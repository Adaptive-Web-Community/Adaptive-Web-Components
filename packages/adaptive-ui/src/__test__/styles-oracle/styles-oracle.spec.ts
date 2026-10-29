import chai from "chai";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { expect } = chai;

/**
 * Tests the style generation of the `aui` CLI.
 *
 * The fixtures in this directory (`components` and `anatomies`) are compiled by `scripts/styles-oracle.mjs` using the
 * CLI, and the result is compared to the stored baseline. The capabilities below are also asserted directly so the
 * intent of the baseline is clear, and so a baseline which was updated incorrectly is still noticed.
 *
 * To accept intentional changes to the output, run `npm run styles:oracle:update`, and review the diff of the baseline.
 */

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const outputDir = path.join(packageRoot, "dist/esm/__test__/styles-oracle/output");

/** Reads a generated file, with whitespace collapsed so assertions don't depend on formatting. */
const read = (file: string): string =>
    fs.readFileSync(path.join(outputDir, file), "utf8").replace(/\s+/g, " ");

/** Reads a generated file without the header comment, which includes the source path. */
const readBody = (file: string): string =>
    fs.readFileSync(path.join(outputDir, file), "utf8").split("\n").slice(1).join("\n");

interface Capability {
    /** The capability of the style generation being tested. */
    name: string;
    /** The generated file, relative to the output directory. `code` is from TypeScript and `json` is from JSON anatomies. */
    file: string;
    /** Text (with whitespace collapsed) that must be in the file. */
    includes?: string[];
    /** Text (with whitespace collapsed) that must not be in the file. */
    excludes?: string[];
}

const capabilities: Capability[] = [
    // Samples adapted from Adaptive Web Components
    {
        name: "uses `:host` as the default context, with attribute based interactivity",
        file: "code/button.css",
        includes: [
            ":host(:not([disabled])) control:hover {",
            ":host(:not([disabled])) control:active {",
            ":host([disabled]) control {",
        ],
    },
    {
        name: "applies disabled styles to all children when the focus is on a part",
        file: "code/button.css",
        includes: [":host([disabled]) * { cursor: not-allowed; }"],
    },
    {
        name: "applies disabled styles to the context when the focus is on the context",
        file: "code/tab.css",
        includes: [":host([disabled]) { cursor: not-allowed; }"],
    },
    {
        name: "applies a pointer cursor to the focus target when interactive",
        file: "code/button.css",
        includes: [":host(:not([disabled])) control { cursor: pointer; }"],
    },
    {
        name: "applies a pointer cursor to the context when the context is the focus target",
        file: "code/tab.css",
        includes: [":host(:not([disabled])) { cursor: pointer; }"],
    },
    {
        name: "applies the focus indicator to the focus target",
        file: "code/button.css",
        includes: ["control:focus-visible { outline-color: var(--color-focusStroke);"],
    },
    {
        name: "applies the focus indicator to the context",
        file: "code/tab.css",
        includes: [":host(:focus-visible) { outline-color: var(--color-focusStroke);"],
    },
    {
        name: "applies the focus indicator on `:focus-within` with a reset on the focusable part",
        file: "code/text-field.css",
        includes: ["root:focus-within { outline-color:", "control:focus-visible { outline-style: none; }"],
    },
    {
        name: "supports interactivity based on `href` without a disabled state",
        file: "code/anchor.css",
        includes: [":host([href]) control:hover {", ":host([href]) control:active {"],
        excludes: ["not-allowed"],
    },
    {
        name: "combines a boolean condition on the context with the interactivity",
        file: "code/anchor.css",
        includes: [":host(:not([href])) control {"],
    },
    {
        name: "generates only the rest state with no interactivity",
        file: "code/divider.css",
        excludes: [":hover", ":active", ":focus-visible", "cursor"],
    },
    {
        name: "supports conditions with multiple string values",
        file: "code/divider.css",
        includes: [
            ":host([orientation=\"horizontal\"]) { border-top:",
            ":host([orientation=\"vertical\"]) { border-left:",
        ],
    },
    {
        name: "merges longhand properties into shorthand",
        file: "code/divider.css",
        includes: ["border-top: var(--shape-strokeThickness-default) solid var(--color-neutral-stroke-subtle);"],
        excludes: ["border-top-style", "border-top-width", "border-top-color"],
    },
    {
        name: "combines shared styles with properties using the rest state of a token set",
        file: "code/tooltip.css",
        includes: ["box-shadow: var(--elevation-tooltip);", "background: var(--color-neutral-fill-subtle);"],
        excludes: [":hover"],
    },
    {
        name: "uses the extension option for the output file",
        file: "code/tab.scss",
        includes: [":host([disabled]) { cursor: not-allowed; }"],
    },

    // Stress tests, defined in code
    {
        name: "uses a custom context element",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors {", ".stress-selectors.size-small { gap: 4px; }"],
        excludes: [":host"],
    },
    {
        name: "uses custom selectors for each interactive state",
        file: "code/stress-selectors.css",
        includes: [
            ".stress-selectors:not(.locked).is-hovered { background: var(--color-neutral-fill-subtle-hover);",
            ".stress-selectors:not(.locked).is-active { background: var(--color-neutral-fill-subtle-active);",
            ".stress-selectors:not(.locked).is-focused { background: var(--color-neutral-fill-subtle-focus);",
            ".stress-selectors.locked { background: var(--color-neutral-fill-subtle-disabled);",
        ],
    },
    {
        name: "uses a custom selector for the focus indicator state",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors .content.is-focused { outline-color:"],
    },
    {
        name: "adds `fill: currentcolor` for the foreground at rest",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors { background: var(--color-neutral-fill-subtle); color: var(--color-neutral-stroke-readable); fill: currentcolor; }"],
    },
    {
        name: "combines a condition on the context with a part",
        file: "code/stress-selectors.css",
        includes: [
            ".stress-selectors[aria-selected=\"true\"] .content {",
            ".stress-selectors[aria-selected=\"true\"]:not(.locked) .content.is-hovered {",
        ],
    },
    {
        name: "applies the state to the context element instead of the part",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors:not(.locked).is-hovered .label { color: var(--color-neutral-stroke-readable-hover); }"],
    },
    {
        name: "supports a condition on the part",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors .label.dim { opacity: 0.6; }"],
    },
    {
        name: "supports pseudo element and exported parts, which don't have a state selector",
        file: "code/stress-selectors.css",
        includes: [
            ".stress-selectors::before { background: var(--color-neutral-fill-subtle); }",
            ".stress-selectors::part(icon) { color: var(--color-neutral-stroke-readable);",
            ".stress-selectors.locked::part(icon) { color: var(--color-neutral-stroke-readable-disabled); }",
        ],
    },
    {
        name: "supports all descendants as a part",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors * { opacity: 0.9; }"],
    },
    {
        name: "collapses a part that is the same as the context",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors { opacity: 1; }"],
    },
    {
        name: "supports a different context for a single rule",
        file: "code/stress-selectors.css",
        includes: [".other-context.other-condition { background: var(--color-neutral-fill-subtle); }"],
    },
    {
        name: "ignores the interactive condition when requested for the target",
        file: "code/stress-selectors.css",
        includes: [".stress-selectors .content.is-hovered { background: var(--color-neutral-fill-subtle-hover); }"],
    },
    {
        name: "uses the directory name and `:host` when the anatomy has no name or context",
        file: "code/stress-values.css",
        includes: [":host {", ":host([disabled]) { cursor: not-allowed; }"],
    },
    {
        name: "composes shared styles and properties, with later values replacing earlier values",
        file: "code/stress-values.css",
        includes: ["padding: 4px 8px;", "opacity: 0.5;", "gap: var(--global-designUnit);"],
        excludes: ["opacity: 0;", "opacity: 1;"],
    },
    {
        name: "supports number values, including zero, and any other css property",
        file: "code/stress-values.css",
        includes: ["z-index: 2;", "flex-grow: 0;", "transition: opacity 0.2s;"],
    },
    {
        name: "supports css directives as values",
        file: "code/stress-values.css",
        includes: ["box-shadow: 0px 2px 4px 1px #000000;", "border-width: var(--shape-strokeThickness-default);", "border-radius: 4px;"],
    },
    {
        name: "supports custom interactive values, skipping states without a value",
        file: "code/stress-values.css",
        includes: [
            ":host([disabled]) { background: var(--color-neutral-fill-subtle-disabled); color: gray; }",
            ":host(:not([disabled]):hover) { background: var(--color-neutral-fill-subtle-hover); color: blue; }",
            ":host(:not([disabled]):focus-visible) { background: var(--color-neutral-fill-subtle-focus); }",
        ],
    },
    {
        name: "supports a focus indicator on a child with a reset on the context",
        file: "code/stress-focus.css",
        includes: [
            ".stress-focus:focus-visible { outline-style: none; }",
            ".stress-focus:focus-visible indicator { outline-color:",
            ".stress-focus:not(.disabled):hover indicator {",
        ],
    },
    {
        name: "supports an explicit cursor part and type",
        file: "code/stress-focus.css",
        includes: [".stress-focus:not(.disabled) .handle { cursor: grab; }", ".stress-focus.disabled * { cursor: not-allowed; }"],
        excludes: ["cursor: pointer"],
    },
    {
        name: "supports a component that is always interactive, without a disabled state or condition",
        file: "code/stress-always.css",
        includes: [".stress-always root { cursor: text; }", ".stress-always root:hover {", ".stress-always root:active {"],
        excludes: [":not(", "not-allowed"],
    },
    {
        name: "doesn't add a cursor or focus styles without a focus definition, but does disable the context",
        file: "code/stress-no-focus.css",
        includes: [":host([disabled]) { cursor: not-allowed; }", ":host(:not([disabled]):hover) {"],
        excludes: ["cursor: pointer", "outline"],
    },

    // Samples from Polar UI, defined in JSON
    {
        name: "supports JSON anatomies with parts, conditions, shared styles, and properties",
        file: "json/button.css",
        includes: [
            ".button.purpose-normal:not(:disabled):hover {",
            ".button.purpose-normal.icon-only {",
            ".button.purpose-primary:not(:disabled):active {",
        ],
    },
    {
        name: "merges rules with the same declarations",
        file: "json/button.css",
        includes: [".button.purpose-normal.icon-only,.button.purpose-primary {"],
    },
    {
        name: "supports JSON anatomies with imports, a focus reset target, and a cursor type",
        file: "json/text-field.css",
        includes: [
            ".text-field.disabled * { cursor: not-allowed; }",
            ".text-field:not(.disabled):not(.read-only) .control { cursor: text; }",
            ".text-field .control:focus-within { outline-color:",
            ".text-field .field:focus-visible { outline-style: none; }",
            ".text-field .description {",
            ".text-field.invalid .control {",
        ],
    },
    {
        name: "supports the focus state on the context for a part",
        file: "json/checkbox.css",
        includes: [".checkbox.focused .control-container { outline-color:"],
    },
    {
        name: "supports boolean conditions imported from a partial anatomy",
        file: "json/checkbox.css",
        includes: [".checkbox:not(.checked).read-only .control {", ".checkbox.checked.read-only .control {"],
    },
    {
        name: "supports literal values for properties",
        file: "json/dialog.css",
        includes: ["min-height: min(480px, 100vh);", "width: min(602px, 100vw);", "max-height: unset;"],
    },
    {
        name: "supports a component without interactivity",
        file: "json/avatar.css",
        includes: ["display: flex;", "width: 72px;"],
        excludes: [":hover", "cursor"],
    },

    // Stress tests, defined in JSON
    {
        name: "supports multiple conditions, with boolean values of true and false",
        file: "json/stress-conditions.css",
        includes: [
            ".stress-conditions.selected { background: var(--color-accent-fill-ideal);",
            ".stress-conditions:not(.selected) { background: var(--color-neutral-fill-subtle);",
            ".stress-conditions.size-small[emphasis=\"high\"].selected:not([aria-busy=\"true\"]) .content",
        ],
    },
    {
        name: "supports interactivity with custom selectors",
        file: "json/stress-conditions.css",
        includes: [
            ".stress-conditions.selected:not([aria-busy=\"true\"]):hover {",
            ".stress-conditions.selected[aria-busy=\"true\"] {",
        ],
    },
    {
        name: "merges imported anatomies, where parts without a selector use the main definition",
        file: "json/stress-imports.css",
        includes: [
            ".stress-imports .header {",
            ".stress-imports.compact .header {",
            ".stress-imports .footer-from-main {",
            ".stress-imports.open .body-from-import { opacity: 1; }",
            ".stress-imports:not(.open) .body-from-import { opacity: 0; }",
        ],
    },
    {
        name: "reads the deprecated `styles` of a rule as its treatments",
        file: "json/stress-imports.css",
        includes: [".stress-imports .footer-from-main { font-family: var(--typography-fontFamily-default);"],
    },
    {
        name: "supports token, token group, and literal values for properties",
        file: "json/stress-properties.css",
        includes: [
            "background: var(--color-neutral-fill-subtle);",
            "border: var(--shape-strokeThickness-default) solid var(--color-neutral-stroke-subtle);",
            "border-radius: var(--shape-cornerRadius-default);",
            "padding: var(--density-control-vertical-padding) var(--density-control-horizontal-padding);",
            "display: flex;",
            "justify-content: space-between;",
            "width: calc(100% - 8px);",
            "margin-top: -2px;",
            "outline-width: 2px;",
            "transition: opacity 0.2s ease-in-out;",
        ],
    },
    {
        name: "supports the state on the context for the focus target and style rules",
        file: "json/stress-state-on-context.css",
        includes: [
            ".stress-state-on-context.is-focus .header { outline-color:",
            ".stress-state-on-context:not(.disabled).is-hover .header {",
        ],
    },
    {
        name: "supports a cursor definition with a part and type",
        file: "json/stress-state-on-context.css",
        includes: [".stress-state-on-context:not(.disabled) .icon { cursor: grab; }"],
    },
    {
        name: "supports disabling the cursor",
        file: "json/stress-cursor-disabled.css",
        includes: [".stress-cursor-disabled:disabled * { cursor: not-allowed; }"],
        excludes: ["cursor: pointer"],
    },
    {
        name: "skips style rules with an unknown part, and removes unknown focus targets and cursor parts",
        file: "json/stress-unknown-parts.css",
        includes: [".stress-unknown-parts .known { opacity: 1; }", ".stress-unknown-parts.disabled {"],
        excludes: ["opacity: 0;", "outline", "Missing"],
    },
    {
        name: "removes an unknown focus reset target but keeps the focus target",
        file: "json/stress-unknown-reset-target.css",
        includes: [".stress-unknown-reset-target .known:focus-visible { outline-color:"],
        excludes: ["outline-style: none"],
    },

    // The other commands of the CLI
    {
        name: "compiles a single file to a specific location",
        file: "single/button.css",
        includes: [":host(:not([disabled])) control:hover {"],
    },
    {
        name: "pairs a value with the background fill of its rule, a combination no treatment has",
        file: "json/stress-on-fill.css",
        includes: [
            ".stress-on-fill .label { background: var(--color-accent-fill-subtle); color: var(--color-critical-stroke-readable-on-color-accent-fill-subtle);",
            ".stress-on-fill:not([disabled]) .label:hover { background: var(--color-accent-fill-subtle-hover); color: var( --color-critical-stroke-readable-on-color-accent-fill-subtle-hover );",
        ],
    },
    {
        name: "pairs a value with the fill it names, which isn't the background of its rule",
        file: "json/stress-on-fill.css",
        includes: [".stress-on-fill .badge { color: var(--color-blackOrWhite-readable-on-color-accent-fill-readable);"],
    },
    {
        name: "makes a value on a fill the token itself in a rule without a background fill",
        file: "json/stress-on-fill.css",
        includes: [".stress-on-fill .icon { color: var(--color-neutral-stroke-readable);"],
        excludes: [".missing"],
    },
    {
        name: "compiles a JSON anatomy to stdout",
        file: "single/button.json.css",
        includes: [".button.purpose-normal:not(:disabled):hover {"],
    },
    {
        name: "reports anatomies that can't be compiled",
        file: "warnings.txt",
        includes: [
            "stress-no-name.json: JSON anatomy has no name property.",
            "Unknown part \"Missing rule part\" in style rule, skipping.",
            "Unknown part \"Missing focus target\" in focus.focusTarget, skipping.",
            "Unknown part \"Missing reset target\" in focus.resetTarget, skipping.",
            "Unknown part \"Missing cursor part\" in cursor, skipping.",
            "Unknown treatment \"Missing treatment\" in style rule, skipping.",
            "Unknown token \"color.missing.stroke\" in the value on a fill of foregroundFill, skipping.",
            "Unknown token \"color.missing.fill\" in the value on a fill of borderFill, skipping.",
        ],
    },
];

describe("aui styles oracle", () => {
    let result: ReturnType<typeof spawnSync>;

    before(function () {
        // Compiles the fixtures with the CLI.
        this.timeout(180000);
        result = spawnSync(process.execPath, [path.join(packageRoot, "scripts/styles-oracle.mjs")], {
            cwd: packageRoot,
            encoding: "utf8",
        });
    });

    it("should match the baseline", () => {
        expect(result.status, `${result.stdout}${result.stderr}`).to.equal(0);
    });

    describe("capabilities", () => {
        capabilities.forEach(capability => {
            it(`${capability.name} (${capability.file})`, () => {
                const output = read(capability.file);
                capability.includes?.forEach(text => expect(output, text).to.include(text));
                capability.excludes?.forEach(text => expect(output, text).to.not.include(text));
            });
        });
    });

    it("should not generate a stylesheet for an anatomy without a name", () => {
        expect(fs.existsSync(path.join(outputDir, "json/stress-no-name.css"))).to.equal(false);
    });

    it("should not generate a stylesheet for partial anatomies used for imports", () => {
        const generated = fs.readdirSync(path.join(outputDir, "json"));
        expect(generated.filter(file => file.startsWith("_"))).to.deep.equal([]);
    });

    it("should generate the same styles for a single file or a JSON anatomy to stdout", () => {
        expect(readBody("single/button.css")).to.equal(readBody("code/button.css"));
        expect(readBody("single/button.json.css")).to.equal(readBody("json/button.css"));
        expect(readBody("code/tab.scss")).to.equal(readBody("code/tab.css"));
    });

    it("should generate a stylesheet for every fixture", () => {
        const components = fs.readdirSync(path.join(packageRoot, "src/__test__/styles-oracle/components"));
        components.forEach(component => {
            expect(fs.existsSync(path.join(outputDir, `code/${component}.css`)), component).to.equal(true);
        });
        const anatomies = fs.readdirSync(path.join(packageRoot, "src/__test__/styles-oracle/anatomies"))
            .filter(file => !file.startsWith("_") && file !== "stress-no-name.json");
        anatomies.forEach(anatomy => {
            expect(fs.existsSync(path.join(outputDir, `json/${anatomy.replace(".json", ".css")}`)), anatomy).to.equal(true);
        });
    });
});
