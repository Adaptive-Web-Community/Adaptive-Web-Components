import "./install-dom-shim.js";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { pathToFileURL } from "url";
import { matcher } from "matcher"
import * as prettier from "prettier";
import { ComposableStyles, ElementStyles } from '@microsoft/fast-element';
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { Command } from 'commander';
import { kebabCase } from "change-case";
import { deepmerge } from "deepmerge-ts";
import { glob } from "glob";
import postcss, { type Processor} from "postcss";
import postcssMergeLonghand from "postcss-merge-longhand";
import postcssMergeRules from "postcss-merge-rules"
import postcssMergeBorderRadius from "postcss-merge-border-radius";
import { ElementStylesRenderer } from '../core/modules/element-styles-renderer.js';
import {
    ComponentAnatomy,
    ComponentConditions,
    ComponentParts,
    SerializableAnatomy,
    SerializableAnatomyWithImports,
    SerializableBooleanCondition,
    SerializableStringCondition,
    SerializableStyleRule,
    StyleModuleTarget,
    StyleRules
} from '../core/modules/types.js';
import {
    DesignTokenRegistry,
    StyleProperties,
    StyleRule,
    Styles,
} from "../core/index.js";
import { disabledStyles, focusIndicatorStyles, focusResetStyles } from "../reference/index.js";

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

        const { css } = await compileFile(inFilePath, exportNames.s, exportNames.a, outFilePath);

        writeStyleFile(css, outFilePath)
        process.exit(0);
    })

program.command("compile-styles <glob>")
    .description("")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy exports. This option supports wildcards.", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles exports. This option supports wildcards.", "styles")
    .option("-e <extension>, --extension <extension>", "The file extension of the file to write.", ".css")
    .action(async (globPath, args: { a: string, s: string, e: string }) => {
        const paths = await glob(globPath, { absolute: true });

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

            const { css, anatomyName } = await compileFile(inFilePath, args.s, args.a, outFilePath);

            if (!outFilePath) {
                outFilePath = resolveStylesheetOutputPath(inFilePath, anatomyName, args.e);
            }

            writeStyleFile(css, outFilePath);
        }));

        process.exit(0);
    });

program.command("compile-json-anatomy <anatomyPath>")
    .description("Compile a stylesheet from a JSON anatomy")
    .action(async (jsonPath: string) => {
        const jsonData = await readJsonAnatomyWithImports(jsonPath);
        const styles = jsonToAUIStyleSheet(jsonData);
        const outFilePath = resolveStylesheetOutputPath(jsonPath, jsonData.name, ".css");
        const css = await compileStylesheet(styles, jsonPath, outFilePath);

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
    } catch (e) {
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
    await import("../reference/index.js");

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
): Promise<{ css: string, anatomyName: string }> {
    ensureFileExists(inFilePath);

    const formatPath = outFilePath ?? path.format({ ...path.parse(inFilePath), ext: ".css" });
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

    return { css, anatomyName: resolvedAnatomyName };
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

// TODO This is a reasonable default using the reference AUI configuration, but should be configurable.
ElementStylesRenderer.disabledStyles = disabledStyles;
ElementStylesRenderer.focusStateStyles = focusIndicatorStyles;
ElementStylesRenderer.focusResetStyles = focusResetStyles;

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

            const styles = style.styles?.map(name => {
                return Styles.Shared.get(name)!;
            });

            const properties: StyleProperties = {};
            if (style.properties) {
                Object.entries(style.properties).map(entry => {
                    const target = entry[0];
                    const value = entry[1];
                    const token = DesignTokenRegistry.Shared.get(value);
                    if (token) {
                        properties[target] = token as CSSDesignToken<any>;
                    } else {
                        const group = DesignTokenRegistry.Groups.get(value);
                        if (group) {
                            properties[target] = group;
                        } else {
                            properties[target] = value;
                        }
                    }
                });
            }

            const target: StyleModuleTarget = {
                context: obj.context,
                contextCondition: createCondition(obj, style),
                stateOnContext: style.stateOnContext,
                part: partFromResolution(partResolution),
            };

            const rule: StyleRule = {
                target,
                styles,
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