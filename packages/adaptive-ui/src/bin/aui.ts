import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { pathToFileURL } from "url";
import { matcher } from "matcher"
import * as prettier from "prettier";
import { Command } from 'commander';
import { refs } from "design-token-library";
import { kebabCase } from "change-case";
import { deepmerge } from "deepmerge-ts";
import { glob } from "glob";
import postcss, { type Processor} from "postcss";
import postcssMergeLonghand from "postcss-merge-longhand";
import postcssMergeRules from "postcss-merge-rules"
import postcssMergeBorderRadius from "postcss-merge-border-radius";
import {
    ComponentAnatomy,
    ComponentConditions,
    ComponentParts,
    SerializableAnatomy,
    SerializableAnatomyWithImports,
    SerializableBooleanCondition,
    SerializableStringCondition,
    SerializableStyleRule,
} from '../core/styles/anatomy.js';
import { formatRules, libraryTokenProperties } from '../core/styles/css/rules.js';
import { renderStyleRules, styleRulesOnFills } from '../core/styles/css/style-rules.js';
import { deserializeOnFill, isSerializableOnFill, OnFill, SerializableOnFill, serializeOnFill } from '../core/styles/on-fill.js';
import { StyleProperties, StyleValues } from '../core/styles/properties.js';
import { StyleRule, StyleRules, StyleRuleTarget } from '../core/styles/rule.js';
import { InteractiveState } from '../core/interactive.js';
import { ResolvedTokenName, resolveTokenName, tokenNames } from '../core/token-names.js';
import { refAt } from '../core/token-ref.js';
import { createReferenceLibrary, ReferenceLibraryTokens } from '../reference/library.js';
import { referenceAnatomyTreatments, referenceTreatments } from '../reference/treatments.js';

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
    .option("--on-fills <file>", "Write the values on a fill of the compiled styles to a JSON file, for the CSS of the tokens of each scope.")
    .action(async (inFile, outFile, exportNames: { a: string, s: string, onFills?: string }) => {
        const cwd = process.cwd();
        const inFilePath = path.resolve(cwd, inFile);
        const outFilePath = path.resolve(cwd, outFile);

        ensureFileExists(inFilePath);

        const { css, onFills } = await compileFile(inFilePath, exportNames.s, exportNames.a, outFilePath);

        writeStyleFile(css, outFilePath)
        writeOnFillsFile(onFills, exportNames.onFills);
        process.exit(0);
    })

program.command("compile-styles <glob>")
    .description("")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy exports. This option supports wildcards.", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles exports. This option supports wildcards.", "styles")
    .option("-e <extension>, --extension <extension>", "The file extension of the file to write.", ".css")
    .option("--on-fills <file>", "Write the values on a fill of the compiled styles to a JSON file, for the CSS of the tokens of each scope.")
    .action(async (globPath, args: { a: string, s: string, e: string, onFills?: string }) => {
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
        const styles = jsonToAUIStyleSheet(jsonData);
        const outFilePath = resolveStylesheetOutputPath(jsonPath, jsonData.name, ".css");
        const css = await compileStylesheet(styles, jsonPath, outFilePath);

        // The CSS is written to stdout, so the file is written without a message.
        writeOnFillsFile(new SheetCompilerImpl().onFills(styles), args.onFills, false);
        process.stdout.write(css);
        process.stdout.end();
    });

program.parse()

/**
 * Fatal test to ensure a file exists
 */
function ensureFileExists(inFilePath: string) {
    try {
        fs.statSync(inFilePath)
    } catch {
        console.warn(failColor, `File not found: ${inFilePath}`)
        process.exit(1)
    }
}

/**
 * Resolve the output CSS path from an anatomy name, matching the designer convention.
 */
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

            // If `parts` are in the import, they are either for validation/consistency of that file
            // or additive to the main anatomy definition.
            // If the part selector is empty, remove it an use the value from the main anatomy definition.
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
    styles: AUIStyleSheet,
    inFilePath: string,
    outFilePath: string
): Promise<string> {
    const compiler = new SheetCompilerImpl();
    const compiled = compiler.compile(styles);
    const formatted = await prettier.format(compiled, { filepath: outFilePath });
    const minified = await mergeCSSRules(formatted);

    return createGeneratedStylesheetHeader(inFilePath, outFilePath) + minified;
}

/**
 * Compile a single input file to CSS.
 */
async function compileFile(
    inFilePath: string,
    stylesName: string,
    anatomyName: string,
    outFilePath?: string
): Promise<{ css: string, anatomyName: string, onFills: SerializableOnFill[] }> {
    ensureFileExists(inFilePath);

    // Only used to select the prettier parser. `base` must be excluded, otherwise `path.format` ignores `ext`.
    const { dir, name } = path.parse(inFilePath);
    const formatPath = outFilePath ?? path.format({ dir, name, ext: ".css" });
    let styles: AUIStyleSheet;
    let resolvedAnatomyName: string;

    if (isJsonAnatomyFile(inFilePath)) {
        const jsonData = await readJsonAnatomyWithImports(inFilePath);
        resolvedAnatomyName = jsonData.name;
        styles = jsonToAUIStyleSheet(jsonData);
    } else {
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
            console.error(failColor, `No anatomy for export matching '${anatomyName}'.`)
            process.exit(1);
        } else if (anatomyExportsName.length > 1) {
            console.warn(
                warnColor,
                `Multiple exports for anatomy found in ${inFilePath}.\nConsider re-naming exports or fixing the --anatomy matcher.`
            );
        }

        styles = {
            rules: module[stylesExportName[0]],
            anatomy: module[anatomyExportsName[0]]
        };
        resolvedAnatomyName = resolveAnatomyName(styles.anatomy, inFilePath);
    }

    const css = await compileStylesheet(styles, inFilePath, formatPath);

    return { css, anatomyName: resolvedAnatomyName, onFills: new SheetCompilerImpl().onFills(styles) };
}

/**
 * Writes the values on a fill of the compiled styles, each once, in order, if a file is given. The CSS of the tokens of each scope writes
 * their custom properties with `onFillCSS`, after `deserializeOnFill`.
 */
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

    /**
     * The values on a fill of a sheet, written as data, for the CSS of the tokens.
     */
    onFills(sheet: AUIStyleSheet): SerializableOnFill[];
}

// TODO This is a reasonable default using the reference AUI configuration, but should be configurable.
const library = createReferenceLibrary();
const tokens = libraryTokenProperties(library, { context: refs<ReferenceLibraryTokens>().color.context });
const treatmentsByName = new Map(referenceTreatments.map(treatment => [treatment.name, treatment]));

class SheetCompilerImpl implements SheetCompiler {
    /**
     * Compiles an AUI stylesheet into a string
     * @param sheet  - the sheet to compile
     * @returns 
     */
    compile(sheet: AUIStyleSheet): string {
        return formatRules(renderStyleRules(sheet.rules, { tokens, anatomy: sheet.anatomy, treatments: referenceAnatomyTreatments }));
    }

    onFills(sheet: AUIStyleSheet): SerializableOnFill[] {
        return styleRulesOnFills(sheet.rules, { anatomy: sheet.anatomy, treatments: referenceAnatomyTreatments }).map(value => serializeOnFill(value));
    }
}

const names = tokenNames(library);

/**
 * The token of a name written as data, reporting a name that was renamed, so it is updated, and a token that is deprecated.
 */
function tokenOf(name: string): ResolvedTokenName | undefined {
    const found = resolveTokenName(names, name);
    if (found?.renamed) {
        console.warn(warnColor, `The token "${name}" was renamed to "${found.name}", update the source.`);
    }
    if (found !== undefined && found.deprecated !== false) {
        const why = typeof found.deprecated === "string" ? ` ${found.deprecated}` : "";
        console.warn(warnColor, `The token "${found.name}" is deprecated.${why}`);
    }
    return found;
}

/**
 * The value of a property written as data: a ref to the token of that name, a name it had, or the root of a group of that name, or the
 * name as it is. A state after the name of an interactive token, like `color.neutral.fill.subtle.rest`, which was a token of its own, is
 * that state of the token, at rest.
 */
function propertyValue(value: string): StyleValues | undefined {
    const found = tokenOf(value);
    if (found === undefined) {
        return value;
    }
    if (found.state === undefined) {
        return refAt(found.path);
    }
    if (found.state === InteractiveState.rest) {
        return { rest: refAt(found.path) };
    }
    console.warn(warnColor, `The token "${value}" is a state of an interactive token, which only its rest can be used as, skipping.`);
    return undefined;
}

/**
 * A value on a fill written as data, with a ref to each token it names, or nothing for a name that isn't a token.
 */
function onFillValue(value: SerializableOnFill, property: string): OnFill | undefined {
    // The path of the token that a name finds, which may be the root of a group, or nothing for a name that isn't a token.
    const pathOf = (name: string): string | undefined => {
        const found = tokenOf(name);
        if (found === undefined || found.state !== undefined) {
            console.warn(warnColor, `Unknown token "${name}" in the value on a fill of ${property}, skipping.`);
            return undefined;
        }
        return found.path.join(".");
    };
    const token = pathOf(value.token);
    const fill = value.fill === undefined ? undefined : pathOf(value.fill);
    if (token === undefined || (value.fill !== undefined && fill === undefined)) {
        return undefined;
    }
    return deserializeOnFill({ ...value, token, ...(fill !== undefined && { fill }) });
}

function createCondition(obj: SerializableAnatomy, style: SerializableStyleRule): string | undefined {
    if (style.contextCondition) {
        const conditionSelectors = Object.entries(style.contextCondition).map(entry => {
            const conditionKey = entry[0];
            const value = entry[1];

            const condition = obj.conditions[conditionKey];
            if (typeof value === "string") {
                return (condition as SerializableStringCondition)[value];
            } else {
                if (value === false) {
                    return `:not(${condition as SerializableBooleanCondition})`;
                } else {
                    return condition as SerializableBooleanCondition;
                }
            }
        });
        return conditionSelectors.join("");
    }
}

type PartResolution =
    | { kind: "context" }
    | { kind: "resolved"; selector: string }
    | { kind: "invalid"; partName: string };

function resolvePart(anatomy: SerializableAnatomy, part?: string): PartResolution {
    if (!part) {
        return { kind: "context" };
    }

    const selector = anatomy.parts[part];
    if (selector === undefined) {
        return { kind: "invalid", partName: part };
    }

    return { kind: "resolved", selector };
}

function partFromResolution(resolution: PartResolution): string | undefined {
    return resolution.kind === "resolved" ? resolution.selector : undefined;
}

function warnUnknownPart(partName: string, context: string): void {
    console.warn(warnColor, `Unknown part "${partName}" in ${context}, skipping.`);
}

function jsonToAUIStyleSheet(obj: SerializableAnatomy): AUIStyleSheet {
    const sheet: AUIStyleSheet = {
        anatomy: {
            name: obj.name,
            context: obj.context,
            conditions: obj.conditions,
            parts: obj.parts,
            interactivity: obj.interactivity,
            focus: obj.focus,
            cursor: obj.cursor,
        },
        rules: obj.styleRules.flatMap(style => {
            const partResolution = resolvePart(obj, style.part);
            if (partResolution.kind === "invalid") {
                warnUnknownPart(partResolution.partName, "style rule");
                return [];
            }

            // `styles` is the deprecated name of `treatments`.
            const treatments = [...(style.styles ?? []), ...(style.treatments ?? [])].flatMap(name => {
                const treatment = treatmentsByName.get(name);
                if (treatment === undefined) {
                    console.warn(warnColor, `Unknown treatment "${name}" in style rule, skipping.`);
                    return [];
                }
                return [treatment];
            });

            const properties: StyleProperties = {};
            if (style.properties) {
                for (const [target, value] of Object.entries(style.properties)) {
                    properties[target] = isSerializableOnFill(value) ? onFillValue(value, target) : propertyValue(value);
                }
            }

            const target: StyleRuleTarget = {
                context: obj.context,
                contextCondition: createCondition(obj, style),
                stateOnContext: style.stateOnContext,
                part: partFromResolution(partResolution),
            };

            const rule: StyleRule = {
                target,
                treatments,
                properties,
            };

            return [rule];
        }),
    }

    if (sheet.anatomy.focus) {
        const focusTargetResolution = resolvePart(obj, sheet.anatomy.focus.focusTarget.part);
        if (focusTargetResolution.kind === "invalid") {
            warnUnknownPart(focusTargetResolution.partName, "focus.focusTarget");
            delete sheet.anatomy.focus;
        } else {
            sheet.anatomy.focus.focusTarget.part = partFromResolution(focusTargetResolution);

            if (sheet.anatomy.focus.resetTarget) {
                const resetTargetResolution = resolvePart(obj, sheet.anatomy.focus.resetTarget.part);
                if (resetTargetResolution.kind === "invalid") {
                    warnUnknownPart(resetTargetResolution.partName, "focus.resetTarget");
                    delete sheet.anatomy.focus.resetTarget;
                } else {
                    sheet.anatomy.focus.resetTarget.part = partFromResolution(resetTargetResolution);
                }
            }
        }
    }

    if (sheet.anatomy.cursor && typeof sheet.anatomy.cursor === "object" && sheet.anatomy.cursor.part) {
        const cursorPartResolution = resolvePart(obj, sheet.anatomy.cursor.part);
        if (cursorPartResolution.kind === "invalid") {
            warnUnknownPart(cursorPartResolution.partName, "cursor");
            sheet.anatomy.cursor.part = undefined;
        } else {
            sheet.anatomy.cursor.part = partFromResolution(cursorPartResolution);
        }
    }

    return sheet;
}

let minifier: null | Processor = null;
async function mergeCSSRules(cssFileData: string): Promise<string> {
    if (minifier === null) {
        minifier = postcss([postcssMergeRules(), postcssMergeLonghand(), postcssMergeBorderRadius()]);
    }

    return await (await minifier.process(cssFileData, { from: "src.css", to: "dist.css"})).toString()
}