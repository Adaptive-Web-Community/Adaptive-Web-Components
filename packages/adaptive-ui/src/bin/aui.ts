import "./install-dom-shim.js";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { matcher } from "matcher"
import * as prettier from "prettier";
import { ComposableStyles, ElementStyles } from '@microsoft/fast-element';
import { Command } from 'commander';
import { glob } from "glob";
import { pathToFileURL } from "url";
import { ElementStylesRenderer } from '../core/modules/element-styles-renderer.js';
import {
    BooleanCondition,
    ComponentAnatomy,
    ComponentConditions,
    ComponentParts,
    SerializableAnatomy,
    SerializableStyleRule,
    StringCondition,
    StyleModuleTarget,
    StyleRules
} from '../core/modules/types.js';
import {
    DesignTokenRegistry,
    StyleProperties,
    StyleRule,
    Styles,
    TypedCSSDesignToken
} from "../core/index.js";

const program = new Command();

program
    .name('aui')
    .description("CLI for Adaptive UI");


const successColor = "\x1b[32m";
const failColor = "\x1b[31m";
const warnColor = "\x1b[33m";

/**
 * Compile a single file
 */
program.command('compile-style <inFile> <outFile>')
    .description("Compile a single AUI stylesheet")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy export. This option supports wildcards.", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles export. This option supports wildcards.", "styles")
    .action(async (inFile, outFile, exportNames: { a: string, s: string }) => {
        const cwd = process.cwd();
        const inFilePath = path.resolve(cwd, inFile);
        const outFilePath = path.resolve(cwd, outFile);

        ensureFileExists(inFilePath);

        const fileData = await compileFile(inFilePath, outFilePath, exportNames.s, exportNames.a);

        writeStyleFile(fileData, outFilePath)
        process.exit(0);
    })

program.command("compile-styles <glob>")
    .description("")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy exports. This option supports wildcards.", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles exports. This option supports wildcards.", "styles")
    .option("-e <extension>, --extension <extension>", "The file extension of the file to write.", ".css")
    .action(async (globPath, args: { a: string, s: string, e: string }) => {
        glob(globPath, { absolute: true }).then(async (paths) => {
            await Promise.all(paths.map(async (inFilePath) => {
                ensureFileExists(inFilePath)
                const outFilePath = path.format({ ...path.parse(inFilePath), base: '', ext: args.e });
                const fileData = await compileFile(inFilePath, outFilePath, args.s, args.a);
                writeStyleFile(fileData, outFilePath);
            }));

            process.exit(0);
        })
    });

program.command("compile-json-anatomy <anatomyPath>")
    .description("Compile a stylesheet from a JSON anatomy")
    .action(async (path: string) => {
        const data = (await fsp.readFile(path)).toString();
        await import("../reference/index.js");

        const jsonData = JSON.parse(data);
        const compiler = new SheetCompilerImpl();
        const sheet = jsonToAUIStyleSheet(jsonData);
        const compiledSheet = compiler.compile(sheet);
        const formatted = await prettier.format(compiledSheet, { filepath: "foo.css" });
        process.stdout.write("/* This file is generated. Do not edit directly */\n",);
        process.stdout.write(formatted)
        process.stdout.end();
    });

program.parse()

/**
 * Fatal test to ensure a file exists
 */
function ensureFileExists(inFilePath: string) {
    try {
        fs.statSync(inFilePath)
    } catch (e) {
        console.warn(failColor, `File not found: ${inFilePath}`)
        process.exit(1)
    }
}

/**
 * Compile a single style file
 */
async function compileFile(inFilePath: string, outFilePath: string, stylesName: string, anatomyName: string): Promise<string> {
    // Ensure inFile exists
    ensureFileExists(inFilePath)

    const module = await import(pathToFileURL(inFilePath).href);
    const exportKeys = Object.keys(module);

    const stylesExportName = matcher(exportKeys, stylesName);
    const anatomyExportsName = matcher(exportKeys, anatomyName);

    if (stylesExportName.length === 0) {
        console.error(failColor, `No style rules for export matching '${stylesName}'.`)
        process.exit(1);
    } else if (stylesExportName.length > 1) {
        console.warn(
            warnColor,
            `Multiple exports for style rules found in ${inFilePath}.\nConsider re-naming exports or fixing the --styles matcher.`
        );
    }


    if (anatomyExportsName.length === 0) {
        console.error(failColor, `No anatomy for export matching '${stylesName}'.`)
        process.exit(1);
    } else if (stylesExportName.length > 1) {
        console.warn(
            warnColor,
            `Multiple exports for anatomy found in ${inFilePath}.\nConsider re-naming exports or fixing the --anatomy matcher.`
        );
    }



    const styles: AUIStyleSheet = {
        rules: module[stylesExportName[0]],
        anatomy: module[anatomyExportsName[0]]
    }

    const compiler = new SheetCompilerImpl();
    const compiled = compiler.compile(styles);

    const formatted = await prettier.format(compiled, { filepath: outFilePath });
    return (`/* This file is generated by Adaptive UI from ${path.relative(outFilePath, inFilePath)} */\n`) + formatted;
}

/**
 * Write a single style file
 */
function writeStyleFile(data: string, outFilePath: string) {
    try {
        fs.statSync(outFilePath);
    } catch {
        fs.mkdirSync(path.parse(outFilePath).dir, { recursive: true });
    }

    fs.writeFileSync(outFilePath, data, { encoding: 'utf8' });
    console.log(successColor, `${outFilePath} compiled successfully.`)
}

/**
 * Representation of a stylesheet
 */
interface AUIStyleSheet<T extends ComponentConditions = any, K extends ComponentParts = any> {
    readonly rules: StyleRules;
    readonly anatomy: ComponentAnatomy<T, K>
}

/**
 * An compiler for stylesheets
 */
interface SheetCompiler {
    compile(sheet: AUIStyleSheet): string;
}

class SheetCompilerImpl implements SheetCompiler {
    /**
     * Compiles an AUI stylesheet into a string
     * @param sheet  - the sheet to compile
     * @returns 
     */
    compile(sheet: AUIStyleSheet): string {
        const elementStyles = ElementStylesRenderer.renderStyleRules([], sheet.rules, sheet.anatomy);
        return this.#reduceStyles(elementStyles.styles)
    }


    #reduceStyles(
        styles: ReadonlyArray<ComposableStyles>
    ): string {
        return styles
            .map((x: ComposableStyles) =>
                x instanceof ElementStyles ? this.#reduceStyles(x.styles) : x instanceof CSSStyleSheet ? "" /* ignore */ : x
            )
            .reduce((prev: string, curr: string) => prev.concat(curr), "");
    }
}

function createCondition(obj: SerializableAnatomy, style: SerializableStyleRule): string | undefined {
    if (style.contextCondition) {
        const conditionSelectors = Object.entries(style.contextCondition).map(entry => {
            const conditionKey = entry[0];
            const value = entry[1];

            const condition = obj.conditions[conditionKey];
            if (typeof value === "string") {
                return (condition as StringCondition)[value];
            } else {
                return condition as BooleanCondition;
            }
        });
        return conditionSelectors.join("");
    }
}

function jsonToAUIStyleSheet(obj: SerializableAnatomy): AUIStyleSheet {
    const sheet: AUIStyleSheet = {
        anatomy: {
            conditions: obj.conditions,
            parts: obj.parts,
            interactivity: obj.interactivity,
        },
        rules: obj.styleRules.map(style => {
            const styles = style.styles?.map(name => {
                return Styles.Shared.get(name)!;
            });

            const properties = style.tokens?.reduce((prev, current) => {
                prev[current.target] = DesignTokenRegistry.Shared.get(current.tokenID) as TypedCSSDesignToken<any>
                return prev;
            }, {} as StyleProperties);

            const target: StyleModuleTarget = {
                context: obj.context,
                contextCondition: createCondition(obj, style),
                part: style.part ? obj.parts[style.part] : undefined,
            };

            const rule: StyleRule = {
                target,
                styles,
                properties,
            };

            return rule;
        }),
    }

    return sheet;
}
