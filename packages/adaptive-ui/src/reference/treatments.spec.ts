import chai from "chai";
import { pathOf, refs } from "design-token-library";
import { Focus, Interactivity } from "../core/styles/anatomy.js";
import { formatRules, libraryTokenProperties, onFillCSS, renderRules } from "../core/styles/css/rules.js";
import { renderStyleRules, styleRulesOnFills } from "../core/styles/css/style-rules.js";
import { onFill } from "../core/styles/on-fill.js";
import { Treatment, treatmentProperties } from "../core/styles/treatment.js";
import { libraryTreatments, treatmentAt } from "../core/styles/treatment-token.js";
import { resolveTokenName, tokenNames } from "../core/token-names.js";
import { AdaptiveDesignToken } from "../core/token-types.js";
import { StyleNameMapping } from "./deprecated.js";
import { createReferenceLibrary, ReferenceLibraryTokens } from "./library.js";
import { referenceAnatomyTreatments } from "./treatments.js";

const { expect } = chai;

const library = createReferenceLibrary();
const t = refs<ReferenceLibraryTokens>();
const { color } = t;
const tokens = libraryTokenProperties(library, { context: color.context });
const treatments = libraryTreatments(library);
const index = tokenNames(library);
const render = (treatment: Treatment) => renderRules(treatmentProperties(treatment), Interactivity.disabledAttribute, tokens);

// The names of the treatment tokens of the library, without the `$root` of a group.
const treatmentNames = [...index.tokens.values()]
    .filter(({ path }) => (path.reduce<any>((node, key) => node[key], library.tokens) as { $type: string }).$type === AdaptiveDesignToken.treatment)
    .map(({ name }) => name);

// The names of the treatments of 0.14, with those that its name map didn't have.
const namesOf014 = [
    ...Object.keys(StyleNameMapping),
    "styles.text-plain-multiline",
    "styles.interactiveCursor",
    "density.text",
    "color.layer-fill-interactive-control",
    "color.accent-hue-shift-gradient-fill-subtle-element",
    "color.accent-to-highlight-gradient-fill-subtle-element",
];

describe("the reference treatments", () => {
    it("should be the 101 treatments of 0.14, which refer only to tokens of the library", () => {
        expect(treatmentNames).to.have.length(101);
        for (const name of treatmentNames) {
            expect(() => render(treatmentAt(library, name)), name).not.to.throw();
        }
    });

    it("should be named by the patterns of a treatment of a set, and of the treatments of a group", () => {
        const pattern = /(^|\.)treatment(\.[a-zA-Z0-9]+)?$|(^|\.)treatments\.[a-zA-Z0-9]+$/;

        expect(treatmentNames.filter(name => !pattern.test(name))).to.deep.equal([]);
    });

    it("should each be found by its name of 0.14", () => {
        for (const old of namesOf014) {
            const found = resolveTokenName(index, old);
            expect(found, old).to.include({ renamed: true });
            expect(treatmentNames, old).to.include(found?.name);
        }
        expect(new Set(namesOf014.map(old => resolveTokenName(index, old)?.name)).size).to.equal(101);
    });

    it("should be found by the samples of each rule of the names", () => {
        const samples: [string, string][] = [
            ["shape.control", "shape.treatments.control"],
            ["density.control", "density.control.treatment"],
            ["density.control-square", "density.control.treatment.square"],
            ["density.item-container", "density.controlList.treatment"],
            ["text.type-ramp-minus-1", "typography.ramp.default.treatments.minus1"],
            ["shadow.card-interactive", "elevation.card.treatment.interactive"],
            ["shadow.dialog", "elevation.dialog.treatment"],
            ["color.layer-fill-interactive-control", "color.layer.treatments.fillInteractiveControl"],
            ["styles.focus-indicator", "treatments.focusIndicator"],
        ];

        for (const [old, name] of samples) {
            expect(resolveTokenName(index, old)?.name, old).to.equal(name);
        }
    });

    it("should pair a fill with the foreground on it", () => {
        const foreground = "--color-blackOrWhite-readable-on-color-accent-fill-readable";
        expect(formatRules(render(treatments(t.color.accent.treatments.fillReadableControl)))).to.equal(
            [
                `:host { background: var(--color-accent-fill-readable); color: var(${foreground}); fill: currentcolor; ` +
                    "border-top-width: var(--shape-strokeThickness-default); border-right-width: var(--shape-strokeThickness-default); " +
                    "border-bottom-width: var(--shape-strokeThickness-default); border-left-width: var(--shape-strokeThickness-default); " +
                    "border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; " +
                    "border-top-color: transparent; border-right-color: transparent; border-bottom-color: transparent; border-left-color: transparent; }",
                `:host(:not([disabled]):focus-visible) { background: var(--color-accent-fill-readable-focus); color: var(${foreground}-focus); }`,
                `:host(:not([disabled]):hover) { background: var(--color-accent-fill-readable-hover); color: var(${foreground}-hover); }`,
                `:host(:not([disabled]):active) { background: var(--color-accent-fill-readable-active); color: var(${foreground}-active); }`,
                `:host([disabled]) { background: var(--color-accent-fill-readable-disabled); color: var(${foreground}-disabled); }`,
            ].join("\n")
        );
    });

    it("should have the custom properties of the pairs that the treatments have, once each", () => {
        const pairs = styleRulesOnFills(
            treatmentNames.map(name => ({ treatments: [treatmentAt(library, name)] })),
            { treatments }
        );
        const css = onFillCSS(library, pairs, { context: color.context });

        // A treatment that is composed of another has its pairs as well.
        expect(new Set(pairs.map(pair => `${pathOf(pair.token).join(".")} on ${pathOf(pair.fill).join(".")}`)).size).to.equal(43);
        expect(css).to.include("--color-accent-stroke-readable-on-color-accent-fill-subtle:");
        expect(css).to.include("--color-neutral-stroke-strong-on-color-layer-fill-interactive-hover:");
        expect(css).not.to.include("--color-critical-stroke-readable-on-color-accent-fill-subtle");
    });

    it("should make a foreground of one palette on the fill of another, a pair that no treatment has", () => {
        const criticalForeground: Treatment = { properties: { foregroundFill: onFill(color.critical.stroke.readable) } };
        const rules = renderRules(treatmentProperties({ treatments: [treatments(t.color.accent.treatments.fillSubtleControl), criticalForeground] }), {}, tokens);

        expect(rules[0].declarations.color).to.equal("var(--color-critical-stroke-readable-on-color-accent-fill-subtle)");
    });

    it("should take the rest of one token and the disabled of another for an element that isn't interactive", () => {
        const rules = render(treatments(t.color.neutral.treatments.dividerSubtleElement));

        expect(rules.map(rule => rule.declarations.color)).to.deep.equal([
            "var(--color-neutral-stroke-subtle)",
            "var(--color-neutral-stroke-strong-disabled)",
        ]);
    });

    it("should take the shadow of the card at rest, and in each state as its variant", () => {
        expect(render(treatments(t.elevation.card.treatment))).to.deep.equal([{ selector: ":host", declarations: { "box-shadow": "var(--elevation-card)" } }]);
        expect(render(treatments(t.elevation.card.treatment.interactive)).map(rule => rule.declarations["box-shadow"])).to.include(
            "var(--elevation-card-hover)"
        );
    });

    it("should apply the treatments it is composed of, and its own properties after them", () => {
        const action = treatments(t.treatments.actionControl);

        expect(action.treatments?.map(composed => composed.name)).to.deep.equal([
            "shape.treatments.control",
            "density.control.treatment",
            "typography.ramp.default.treatments.base",
            "color.neutral.treatments.fillSubtleControl",
        ]);
        expect(render(action)[0].declarations["border-top-color"]).to.equal("var(--color-neutral-stroke-subtle)");
    });

    it("should have the treatments of the anatomy: the disabled cursor, the focus indicator, and the focus reset", () => {
        const anatomy = { conditions: {}, parts: {}, interactivity: Interactivity.disabledAttribute, focus: Focus.contextFocused() };
        const css = formatRules(renderStyleRules([], { tokens, treatments, anatomy, anatomyTreatments: referenceAnatomyTreatments }));

        expect(css).to.include(":host([disabled]) { cursor: not-allowed; }");
        expect(css).to.include(
            ":host(:focus-visible) { outline-color: var(--color-focusStroke); outline-offset: 1px; outline-style: solid; outline-width: var(--shape-strokeThickness-focus); }"
        );
    });
});
