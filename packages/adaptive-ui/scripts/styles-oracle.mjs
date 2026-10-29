// CLI oracle for the style generation of `aui`.
//
// Compiles the anatomies in `src/__test__/styles-oracle` with the `aui` CLI and compares the output to the checked in
// baseline in `src/__test__/styles-oracle/baseline`. The fixtures are test only, and cover each capability of the
// style generation. See the README in that directory.
//
//   npm run styles:oracle          Compile and diff against the baseline, exits 1 when different.
//   npm run styles:oracle:update   Compile and replace the baseline.
//
// The package must be built first (`npm run build`), and the output is in `dist/esm/__test__/styles-oracle/output`.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const aui = path.join(root, "bin/aui.js");
const sourceDir = path.join(root, "src/__test__/styles-oracle");
const baselineDir = path.join(sourceDir, "baseline");
const outDir = path.join(root, "dist/esm/__test__/styles-oracle");

const update = process.argv.includes("--update");

/** Replace machine specific paths and terminal colors so the output is stable. */
const normalize = text => text
    .split(root).join("<root>")
    .replace(/\x1b\[\d+m/g, "")
    .replace(/\\/g, "/");

/** Lists all files, relative and sorted, in a directory. */
const listFiles = (dir, base = dir) =>
    !fs.existsSync(dir) ? [] : fs.readdirSync(dir, { withFileTypes: true })
        .flatMap(entry => entry.isDirectory() ? listFiles(path.join(dir, entry.name), base) : [path.relative(base, path.join(dir, entry.name))])
        .sort();

const warnings = [];
let failed = false;

/** Runs the CLI, collecting anything written to stderr. */
function runAui(args) {
    const result = spawnSync(process.execPath, [aui, ...args], { cwd: root, encoding: "utf8" });
    normalize(result.stderr).split("\n").map(line => line.trim()).filter(Boolean).forEach(line => warnings.push(line));
    if (result.status !== 0) {
        failed = true;
        console.error(`aui ${args.join(" ")} failed with exit code ${result.status}\n${result.stdout}${result.stderr}`);
    }
    return result;
}

if (!fs.existsSync(path.join(root, "dist/esm/bin/aui.js"))) {
    console.error("The package is not built. Run `npm run build` first.");
    process.exit(1);
}

// Generate into a clean directory. The JSON anatomies are copied because the compiler writes the stylesheets next to them.
for (const dir of ["anatomies", "stylesheets", "single", "on-fills", "output", "components/stylesheets"]) {
    fs.rmSync(path.join(outDir, dir), { recursive: true, force: true });
}
fs.mkdirSync(path.join(outDir, "anatomies"), { recursive: true });
fs.cpSync(path.join(sourceDir, "anatomies"), path.join(outDir, "anatomies"), { recursive: true });

// Anatomies defined in code, with the anatomy and style module export name matchers.
// The values on a fill of each run are written to `on-fills`, for the CSS of the tokens.
const onFills = name => ["--on-fills", path.join(outDir, "on-fills", `${name}.json`)];

runAui(["compile-styles", path.join(outDir, "components/*/index.js"), "-a", "*Anatomy", "-s", "*StyleModules", ...onFills("code")]);

// Anatomies defined in JSON, excluding the partial files which are only used for `imports`.
runAui(["compile-styles", path.join(outDir, "anatomies/[!_]*.json"), ...onFills("json")]);

// A different extension for the output.
runAui(["compile-styles", path.join(outDir, "components/tab/index.js"), "-a", "*Anatomy", "-s", "*StyleModules", "-e", ".scss"]);

// A single file to a specific location.
runAui(["compile-style", path.join(outDir, "components/button/index.js"), path.join(outDir, "single/button.css"), "-a", "*Anatomy", "-s", "*StyleModules", ...onFills("single")]);

// A JSON anatomy to stdout.
const stdout = runAui(["compile-json-anatomy", path.join(outDir, "anatomies/button.json"), ...onFills("single.json")]);
fs.mkdirSync(path.join(outDir, "single"), { recursive: true });
fs.writeFileSync(path.join(outDir, "single/button.json.css"), stdout.stdout);

if (failed) {
    process.exit(1);
}

// The compiler writes the stylesheets in a `stylesheets` directory next to the source directory. Collect everything
// to compare in a single directory, with the same structure as the baseline.
const resultDir = path.join(outDir, "output");
fs.cpSync(path.join(outDir, "components/stylesheets"), path.join(resultDir, "code"), { recursive: true });
fs.cpSync(path.join(outDir, "stylesheets"), path.join(resultDir, "json"), { recursive: true });
fs.cpSync(path.join(outDir, "single"), path.join(resultDir, "single"), { recursive: true });
fs.cpSync(path.join(outDir, "on-fills"), path.join(resultDir, "on-fills"), { recursive: true });

// Anything reported as a warning or an error is part of the output, concurrent compiles aren't ordered.
fs.writeFileSync(path.join(resultDir, "warnings.txt"), [...new Set(warnings)].sort().join("\n") + "\n");

const generated = listFiles(resultDir);

if (update) {
    fs.rmSync(baselineDir, { recursive: true, force: true });
    generated.forEach(file => {
        fs.mkdirSync(path.dirname(path.join(baselineDir, file)), { recursive: true });
        fs.copyFileSync(path.join(resultDir, file), path.join(baselineDir, file));
    });
    console.log(`Updated ${generated.length} files in the baseline.`);
    process.exit(0);
}

const baseline = listFiles(baselineDir);
const read = (dir, file) => fs.readFileSync(path.join(dir, file), "utf8");
const added = generated.filter(f => !baseline.includes(f));
const removed = baseline.filter(f => !generated.includes(f));
const changed = generated.filter(f => baseline.includes(f) && read(resultDir, f) !== read(baselineDir, f));

if (added.length + removed.length + changed.length === 0) {
    console.log(`All ${generated.length} files match the baseline.`);
    process.exit(0);
}

added.forEach(f => console.log(`added:   ${f}`));
removed.forEach(f => console.log(`removed: ${f}`));
changed.forEach(f => console.log(`changed: ${f}`));

changed.forEach(f => {
    const diff = spawnSync("diff", ["-u", "--label", `baseline/${f}`, "--label", `generated/${f}`, path.join(baselineDir, f), path.join(resultDir, f)], { encoding: "utf8" });
    console.log("\n" + (diff.stdout || "(diff is unavailable)"));
});

console.error("\nThe generated styles differ from the baseline. If intended, run `npm run styles:oracle:update`.");
process.exit(1);
