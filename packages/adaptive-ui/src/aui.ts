import "./install-dom-shim.js";
import path from "path";
import fs from "fs";
import * as prettier from "prettier";
import { ComposableStyles, ElementStyles } from '@microsoft/fast-element';
import { Command } from 'commander';
import { glob } from "glob";
import { ElementStylesRenderer } from './modules/element-styles-renderer.js';
import { ComponentAnatomy, ComponentConditions, ComponentParts, StyleRules } from './modules/types.js';

const program = new Command();

program
    .name('AUI CLI')
    .description("CLI for Adaptive UI");


const successColor = "\x1b[32m";
const failColor = "\x1b[31m";
const warnColor = "\x1b[33m";

/**
 * Compile a single file
 */
program.command('compile-style <inFile> <outFile>')
    .description("Compile a single AUI stylesheet")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy export", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles export", "styles")
    .action(async (inFile, outFile, exportNames: { a: string, s: string }) => {
        const cwd = process.cwd();
        const inFilePath = path.resolve(cwd, inFile);
        const outFilePath = path.resolve(cwd, outFile);

        ensureFileExists(inFilePath);

        const fileData = await compileFile(inFilePath, outFilePath, exportNames.s, exportNames.a);

        writeStyleFile(fileData, outFilePath)
        process.exit(0);
    })

program.command("compile-styles <glob>").description("")
    .option("-a <name>, --anatomy <name>", "The name of the anatomy exports.", "anatomy")
    .option("-s <name>, --styles <name>", "The name of the styles exports.", "styles")
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
    try {
        fs.statSync(inFilePath)
    } catch (e) {
        console.warn(failColor, `File not found: ${inFilePath}`)
        process.exit(1)
    }

    const module = await import(inFilePath);
    const styles: AUIStyleSheet = {
        rules: module[stylesName],
        anatomy: module[anatomyName]
    }

    if (styles.rules === undefined) {
        console.warn(warnColor, `No style rules for export name '${stylesName}'.`)
    }

    if (styles.anatomy === undefined) {
        console.warn(warnColor, `No anatomy for export name '${anatomyName}'.`)
    }

    const compiler = new SheetCompilerImpl();
    const compiled = compiler.compile(styles);

    return await prettier.format(compiled, { filepath: outFilePath });
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