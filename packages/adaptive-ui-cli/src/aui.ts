import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { pathToFileURL } from "url";
import { matcher } from "matcher";
import * as prettier from "prettier";
import { Command } from "commander";
import { kebabCase } from "change-case";
import { deepmerge } from "deepmerge-ts";
import { glob } from "glob";
import postcss, { type Processor } from "postcss";
import postcssMergeLonghand from "postcss-merge-longhand";
import postcssMergeRules from "postcss-merge-rules";
import postcssMergeBorderRadius from "postcss-merge-border-radius";
import {
    compileStyleRulesToCss,
    type CompileStyleSheet,
    type ComponentAnatomy,
    jsonToStyleSheet,
    type SerializableAnatomy,
    type SerializableAnatomyWithImports,
    type SerializableOnFill,
    serializeOnFill,
    styleRulesOnFills,
} from "@adaptive-web/adaptive-ui";
import { referenceCompileContext } from "@adaptive-web/adaptive-ui/reference";

const context = referenceCompileContext();

const program = new Command();

program
    .name("aui")
    .description("CLI for Adaptive UI");

const successColor = "\x1b[32m";
const failColor = "\x1b[31m";
const warnColor = "\x1b[33m";

const compileWarn = (message: string) => {
    console.warn(warnColor, message);
};

program.command("compile-style <inFile> <outFile>")
    .description("Compile a single AUI stylesheet")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy export. This option supports wildcards.", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles export. This option supports wildcards.", "styles")
    .option("--on-fills <file>", "Write the values on a fill of the compiled styles to a JSON file, for the CSS of the tokens of each scope.")
    .action(async (inFile, outFile, exportNames: { a: string; s: string; onFills?: string }) => {
        const cwd = process.cwd();
        const inFilePath = path.resolve(cwd, inFile);
        const outFilePath = path.resolve(cwd, outFile);

        ensureFileExists(inFilePath);

        const { css, onFills } = await compileFile(inFilePath, exportNames.s, exportNames.a, outFilePath);

        writeStyleFile(css, outFilePath);
        writeOnFillsFile(onFills, exportNames.onFills);
        process.exit(0);
    });

program.command("compile-styles <glob>")
    .description("")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy exports. This option supports wildcards.", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles exports. This option supports wildcards.", "styles")
    .option("-e <extension>, --extension <extension>", "The file extension of the file to write.", ".css")
    .option("--on-fills <file>", "Write the values on a fill of the compiled styles to a JSON file, for the CSS of the tokens of each scope.")
    .action(async (globPath, args: { a: string; s: string; e: string; onFills?: string }) => {
        const paths = await glob(globPath, { absolute: true });
        const onFills: SerializableOnFill[] = [];

        await Promise.all(paths.map(async (inFilePath) => {
            ensureFileExists(inFilePath);

            let outFilePath: string | undefined;

            if (isJsonAnatomyFile(inFilePath)) {
                const jsonData = JSON.parse((await fsp.readFile(inFilePath)).toString()) as SerializableAnatomyWithImports;
                if (!jsonData.name) {
                    console.warn(warnColor, `Skipping ${inFilePath}: JSON anatomy has no name property.`);
                    return;
                }

                outFilePath = resolveStylesheetOutputPath(inFilePath, jsonData.name, args.e);
            }

            const compiled = await compileFile(inFilePath, args.s, args.a, outFilePath);

            if (!outFilePath) {
                outFilePath = resolveStylesheetOutputPath(inFilePath, compiled.anatomyName, args.e);
            }

            writeStyleFile(compiled.css, outFilePath);
            onFills.push(...compiled.onFills);
        }));

        writeOnFillsFile(onFills, args.onFills);
        process.exit(0);
    });

program.command("compile-json-anatomy <anatomyPath>")
    .description("Compile a stylesheet from a JSON anatomy")
    .option("--on-fills <file>", "Write the values on a fill of the compiled styles to a JSON file, for the CSS of the tokens of each scope.")
    .action(async (jsonPath: string, args: { onFills?: string }) => {
        const jsonData = await readJsonAnatomyWithImports(jsonPath);
        const styles = jsonToStyleSheet(jsonData, context, compileWarn);
        const outFilePath = resolveStylesheetOutputPath(jsonPath, jsonData.name, ".css");
        const css = await compileStylesheet(styles, jsonPath, outFilePath);

        writeOnFillsFile(onFillsOf(styles), args.onFills, false);
        process.stdout.write(css);
        process.stdout.end();
    });

program.parse();

function ensureFileExists(inFilePath: string) {
    try {
        fs.statSync(inFilePath);
    } catch {
        console.warn(failColor, `File not found: ${inFilePath}`);
        process.exit(1);
    }
}

function resolveStylesheetOutputPath(inFilePath: string, anatomyName: string, extension: string): string {
    return path.resolve(path.dirname(inFilePath), `../stylesheets/${kebabCase(anatomyName)}${extension}`);
}

function resolveAnatomyName(anatomy: ComponentAnatomy<any, any>, inFilePath: string): string {
    if (anatomy.name) {
        return anatomy.name;
    }

    return path.basename(path.dirname(inFilePath));
}

function isJsonAnatomyFile(inFilePath: string): boolean {
    return inFilePath.toLowerCase().endsWith(".json");
}

async function readJsonAnatomyWithImports(jsonPath: string): Promise<SerializableAnatomyWithImports> {
    const data = (await fsp.readFile(jsonPath)).toString();
    let jsonData = JSON.parse(data) as SerializableAnatomyWithImports;

    if (jsonData.imports) {
        for (const imp of jsonData.imports) {
            const impWithExt = imp.toLowerCase().endsWith(".json") ? imp : `${imp}.json`;
            const impFilePath = path.format({ ...path.parse(path.join(path.parse(jsonPath).dir, impWithExt)) });
            const impData = (await fsp.readFile(impFilePath)).toString();
            const impJsonData = JSON.parse(impData) as SerializableAnatomy;

            for (const part in impJsonData.parts) {
                if (impJsonData.parts.hasOwnProperty(part)) {
                    if (impJsonData.parts[part] === "") {
                        delete impJsonData.parts[part];
                    }
                }
            }

            jsonData = deepmerge(jsonData, impJsonData);
        }
    }

    return jsonData;
}

function createGeneratedStylesheetHeader(inFilePath: string, outFilePath: string): string {
    const sourcePath = path.relative(path.dirname(outFilePath), inFilePath);

    return `/* This file is generated by Adaptive UI from ${sourcePath}. Do not edit directly. */\n`;
}

async function compileStylesheet(
    styles: CompileStyleSheet,
    inFilePath: string,
    outFilePath: string,
): Promise<string> {
    const compiled = compileStyleRulesToCss(styles, context);
    const formatted = await prettier.format(compiled, { filepath: outFilePath });
    const minified = await mergeCSSRules(formatted);

    return createGeneratedStylesheetHeader(inFilePath, outFilePath) + minified;
}

async function compileFile(
    inFilePath: string,
    stylesName: string,
    anatomyName: string,
    outFilePath?: string,
): Promise<{ css: string; anatomyName: string; onFills: SerializableOnFill[] }> {
    ensureFileExists(inFilePath);

    const { dir, name } = path.parse(inFilePath);
    const formatPath = outFilePath ?? path.format({ dir, name, ext: ".css" });
    let styles: CompileStyleSheet;
    let resolvedAnatomyName: string;

    if (isJsonAnatomyFile(inFilePath)) {
        const jsonData = await readJsonAnatomyWithImports(inFilePath);
        resolvedAnatomyName = jsonData.name;
        styles = jsonToStyleSheet(jsonData, context, compileWarn);
    } else {
        const module = await import(pathToFileURL(inFilePath).href);
        const exportKeys = Object.keys(module);

        const stylesExportName = matcher(exportKeys, stylesName);
        const anatomyExportsName = matcher(exportKeys, anatomyName);

        if (stylesExportName.length === 0) {
            console.error(failColor, `No style rules for export matching '${stylesName}'.`);
            process.exit(1);
        } else if (stylesExportName.length > 1) {
            console.warn(
                warnColor,
                `Multiple exports for style rules found in ${inFilePath}.\nConsider re-naming exports or fixing the --styles matcher.`,
            );
        }

        if (anatomyExportsName.length === 0) {
            console.error(failColor, `No anatomy for export matching '${anatomyName}'.`);
            process.exit(1);
        } else if (anatomyExportsName.length > 1) {
            console.warn(
                warnColor,
                `Multiple exports for anatomy found in ${inFilePath}.\nConsider re-naming exports or fixing the --anatomy matcher.`,
            );
        }

        styles = {
            rules: module[stylesExportName[0]],
            anatomy: module[anatomyExportsName[0]],
        };
        resolvedAnatomyName = resolveAnatomyName(styles.anatomy, inFilePath);
    }

    const css = await compileStylesheet(styles, inFilePath, formatPath);

    return { css, anatomyName: resolvedAnatomyName, onFills: onFillsOf(styles) };
}

// The values on a fill that the rules of a stylesheet refer to, as data for the CSS of the tokens of each scope.
function onFillsOf(styles: CompileStyleSheet): SerializableOnFill[] {
    return styleRulesOnFills(styles.rules, {
        treatments: context.treatments,
        anatomy: styles.anatomy,
        anatomyTreatments: context.anatomyTreatments,
    }).map(value => serializeOnFill(value));
}

function writeOnFillsFile(onFills: SerializableOnFill[], outFilePath: string | undefined, report = true) {
    if (outFilePath === undefined) {
        return;
    }
    const byKey = new Map(onFills.map(value => [JSON.stringify(value), value]));
    const sorted = [...byKey.values()].sort((a, b) => `${a.token} ${a.fill}`.localeCompare(`${b.token} ${b.fill}`));
    const filePath = path.resolve(process.cwd(), outFilePath);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + "\n", { encoding: "utf8" });
    if (report) {
        console.log(successColor, `${filePath} written with ${sorted.length} values on a fill.`);
    }
}

function writeStyleFile(data: string, outFilePath: string) {
    try {
        fs.statSync(outFilePath);
    } catch {
        fs.mkdirSync(path.parse(outFilePath).dir, { recursive: true });
    }

    fs.writeFileSync(outFilePath, data, { encoding: "utf8" });
    console.log(successColor, `${outFilePath} compiled successfully.`);
}

let minifier: null | Processor = null;
async function mergeCSSRules(cssFileData: string): Promise<string> {
    if (minifier === null) {
        minifier = postcss([postcssMergeRules(), postcssMergeLonghand(), postcssMergeBorderRadius()]);
    }

    return await (await minifier.process(cssFileData, { from: "src.css", to: "dist.css" })).toString();
}
