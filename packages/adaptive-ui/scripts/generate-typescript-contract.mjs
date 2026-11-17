// Generates `*.generated.ts` contract artifacts from `*.documentation` modules.
//
// Single file:
//   node --import tsx @adaptive-web/adaptive-ui/generate-typescript-contract \\
//     <documentationModule> <exportName> <output.ts> [symbolPrefix]
//
// Scan a source tree (every `*.documentation.ts` → sibling `*.generated.ts`):
//   node --import tsx @adaptive-web/adaptive-ui/generate-typescript-contract --scan <srcDir>
//
// Documentation modules may be `.ts` when `tsx` is registered (see `--import tsx` above) or compiled `.js`.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
    typeScriptContractConvention,
    generateTypeScriptContractSource,
} from "@adaptive-web/adaptive-ui";

const convention = typeScriptContractConvention;

function listDocumentationModules(srcDir) {
    const results = [];
    function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (/\.documentation\.(ts|js|mts|mjs)$/.test(entry.name)) {
                results.push(full);
            }
        }
    }
    walk(path.resolve(process.cwd(), srcDir));
    return results.sort();
}

async function loadDocumentation(modulePath, exportName) {
    const resolvedModule = path.resolve(process.cwd(), modulePath);
    const documentationModule = await import(pathToFileURL(resolvedModule).href);
    const documentation = documentationModule[exportName];
    if (!documentation || typeof documentation !== "object") {
        throw new Error(`Export "${exportName}" was not found on ${resolvedModule}.`);
    }
    return documentation;
}

// The specifier of a generated module, from the module that imports it.
function moduleSpecifier(fromOutputPath, toOutputPath) {
    const relative = path.relative(path.dirname(fromOutputPath), toOutputPath).split(path.sep).join("/");
    return (relative.startsWith(".") ? relative : `./${relative}`).replace(/\.ts$/, ".js");
}

// `includeModules` maps the id of each contract that `documentation` includes to the generated module of its own.
function writeFromDocumentation(documentation, modulePath, outputPath, symbolPrefix, generatedById = new Map()) {
    const resolvedModule = path.resolve(process.cwd(), modulePath);
    const resolvedOutput = path.resolve(process.cwd(), outputPath);
    const includeModules = {};
    for (const included of documentation.contract?.include ?? []) {
        const generated = generatedById.get(included.id);
        if (generated !== undefined) {
            includeModules[included.id] = moduleSpecifier(resolvedOutput, generated);
        }
    }
    const source = generateTypeScriptContractSource(documentation, {
        symbolPrefix,
        sourceModule: path.relative(process.cwd(), resolvedModule) || resolvedModule,
        includeModules,
    });
    fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
    fs.writeFileSync(resolvedOutput, source);
    console.log(`Wrote ${resolvedOutput}`);
}

const args = process.argv.slice(2);
const scanIndex = args.indexOf("--scan");

if (scanIndex !== -1) {
    const srcDir = args[scanIndex + 1];
    if (!srcDir) {
        console.error("Usage: generate-typescript-contract --scan <srcDir>");
        process.exit(1);
    }
    const modules = listDocumentationModules(srcDir);
    if (modules.length === 0) {
        console.log(`No *.documentation.ts modules under ${srcDir}.`);
        process.exit(0);
    }
    // Load them all first: a contract that includes another imports the module generated from it.
    const documented = await Promise.all(
        modules.map(async (modulePath) => {
            const basename = convention.moduleBasename(path.basename(modulePath));
            const exportName = convention.documentationExportName(basename);
            const outputPath = path.resolve(path.dirname(modulePath), convention.generatedFileName(basename));
            return { modulePath, outputPath, documentation: await loadDocumentation(modulePath, exportName) };
        }),
    );
    const generatedById = new Map(documented.map(({ documentation, outputPath }) => [documentation.id, outputPath]));
    for (const { modulePath, outputPath, documentation } of documented) {
        writeFromDocumentation(documentation, modulePath, outputPath, undefined, generatedById);
    }
} else {
    const [modulePath, exportName, outputPath, symbolPrefix] = args;
    if (!modulePath || !exportName || !outputPath) {
        console.error(
            "Usage: generate-typescript-contract <documentationModule> <exportName> <output.ts> [symbolPrefix]",
        );
        console.error("   or: generate-typescript-contract --scan <srcDir>");
        process.exit(1);
    }
    writeFromDocumentation(await loadDocumentation(modulePath, exportName), modulePath, outputPath, symbolPrefix);
}
