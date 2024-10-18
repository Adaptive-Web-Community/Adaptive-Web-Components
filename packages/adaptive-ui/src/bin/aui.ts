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
    .action(async (jsonPath: string) => {
        const data = (await fsp.readFile(jsonPath)).toString();
        await import("../reference/index.js");

        let jsonData = JSON.parse(data) as SerializableAnatomyWithImports;

        if (jsonData.imports) {
            for (const imp of jsonData.imports) {
                const impWithExt = imp.toLowerCase().endsWith(".json") ? imp : `${imp}.json`;
                const impFilePath = path.format({ ...path.parse(path.join(path.parse(jsonPath).dir, impWithExt)) });
                const impData = (await fsp.readFile(impFilePath)).toString();
                const impJsonData = JSON.parse(impData);
                // If `parts` are in the import, they are for validation/consistency of that file, but we want to use the parts
                // list from the main anatomy definition.
                // Consider extending this so imports can add their own known parts.
                delete impJsonData.parts;

                jsonData = deepmerge(jsonData, impJsonData);
            }
        }

        const compiler = new SheetCompilerImpl();
        const sheet = jsonToAUIStyleSheet(jsonData);
        const compiledSheet = compiler.compile(sheet);
        const formatted = await prettier.format(compiledSheet, { filepath: "foo.css" });
        const minified = await mergeCSSRules(formatted);
        process.stdout.write("/* This file is generated. Do not edit directly */\n",);
        process.stdout.write(minified)
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

function resolvePart(anatomy: SerializableAnatomy, part?: string): string | undefined {
    return part ? anatomy.parts[part] : undefined;
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
        },
        rules: obj.styleRules.map(style => {
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
                part: resolvePart(obj, style.part),
            };

            const rule: StyleRule = {
                target,
                styles,
                properties,
            };

            return rule;
        }),
    }

    if (sheet.anatomy.focus) {
        sheet.anatomy.focus.focusTarget.part = resolvePart(obj, sheet.anatomy.focus.focusTarget.part);
        if (sheet.anatomy.focus.resetTarget) {
            sheet.anatomy.focus.resetTarget.part = resolvePart(obj, sheet.anatomy.focus.resetTarget.part);
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