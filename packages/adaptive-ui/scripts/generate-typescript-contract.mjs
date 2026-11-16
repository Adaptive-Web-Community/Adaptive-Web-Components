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

function writeFromModule(modulePath, exportName, outputPath, symbolPrefix) {
    const resolvedModule = path.resolve(process.cwd(), modulePath);
    return import(pathToFileURL(resolvedModule).href).then((documentationModule) => {
        const documentation = documentationModule[exportName];
        if (!documentation || typeof documentation !== "object") {
            throw new Error(`Export "${exportName}" was not found on ${resolvedModule}.`);
        }
        const source = generateTypeScriptContractSource(documentation, {
            symbolPrefix,
            sourceModule: path.relative(process.cwd(), resolvedModule) || resolvedModule,
        });
        const resolvedOutput = path.resolve(process.cwd(), outputPath);
        fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
        fs.writeFileSync(resolvedOutput, source);
        console.log(`Wrote ${resolvedOutput}`);
    });
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
    await Promise.all(
        modules.map(async (modulePath) => {
            const fileName = path.basename(modulePath);
            const basename = convention.moduleBasename(fileName);
            const exportName = convention.documentationExportName(basename);
            const outputPath = path.join(path.dirname(modulePath), convention.generatedFileName(basename));
            await writeFromModule(modulePath, exportName, outputPath);
        }),
    );
} else {
    const [modulePath, exportName, outputPath, symbolPrefix] = args;
    if (!modulePath || !exportName || !outputPath) {
        console.error(
            "Usage: generate-typescript-contract <documentationModule> <exportName> <output.ts> [symbolPrefix]",
        );
        console.error("   or: generate-typescript-contract --scan <srcDir>");
        process.exit(1);
    }
    await writeFromModule(modulePath, exportName, outputPath, symbolPrefix);
}
