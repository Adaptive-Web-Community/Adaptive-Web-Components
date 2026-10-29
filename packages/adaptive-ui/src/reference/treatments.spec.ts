import chai from "chai";
import { pathOf, refs } from "design-token-library";
import { Focus, Interactivity } from "../core/styles/anatomy.js";
import { formatRules, libraryTokenProperties, onFillCSS, renderRules } from "../core/styles/css/rules.js";
import { renderStyleRules, styleRulesOnFills } from "../core/styles/css/style-rules.js";
import { onFill } from "../core/styles/on-fill.js";
import { Treatment, treatmentProperties } from "../core/styles/treatment.js";
import { createReferenceLibrary, ReferenceLibraryTokens } from "./library.js";
import * as treatments from "./treatments.js";
import {
    accentFillReadableControlTreatment,
    actionTreatment,
    neutralDividerSubtleElementTreatment,
    referenceAnatomyTreatments,
    referenceTreatments,
    shadowCardTreatment,
    TreatmentNameMapping,
} from "./treatments.js";

const { expect } = chai;

const library = createReferenceLibrary();
const { color } = refs<ReferenceLibraryTokens>();
const tokens = libraryTokenProperties(library, { context: color.context });
const render = (treatment: Treatment) => renderRules(treatmentProperties(treatment), Interactivity.disabledAttribute, tokens);

describe("the reference treatments", () => {
    it("should refer only to tokens of the reference library", () => {
        for (const treatment of referenceTreatments) {
            expect(() => render(treatment), treatment.name).not.to.throw();
        }
    });

    it("should each have a name of its own", () => {
        const names = referenceTreatments.map(treatment => treatment.name);

        expect(names.every(name => name !== undefined)).to.be.true;
        expect(new Set(names).size).to.equal(names.length);
    });

    it("should be every treatment that is exported", () => {
        const exported = Object.values(treatments).filter(value => referenceTreatments.includes(value as Treatment));

        expect(Object.keys(treatments).filter(key => key.endsWith("Treatment"))).to.have.length(referenceTreatments.length);
        expect(exported).to.have.length(referenceTreatments.length);
    });

    it("should map each name to the export of a treatment", () => {
        for (const [name, exportName] of Object.entries(TreatmentNameMapping)) {
            const treatment = (treatments as Record<string, unknown>)[exportName] as Treatment;
            expect(referenceTreatments, name).to.include(treatment);
        }
    });

    it("should pair a fill with the foreground on it", () => {
        const foreground = "--color-blackOrWhite-readable-on-color-accent-fill-readable";
        expect(formatRules(render(accentFillReadableControlTreatment))).to.equal(
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
        const pairs = styleRulesOnFills(referenceTreatments.map(treatment => ({ treatments: [treatment] })));
        const css = onFillCSS(library, pairs, { context: color.context });

        // A treatment that is composed of another has its pairs as well.
        expect(new Set(pairs.map(pair => `${pathOf(pair.token).join(".")} on ${pathOf(pair.fill).join(".")}`)).size).to.equal(43);
        expect(css).to.include("--color-accent-stroke-readable-on-color-accent-fill-subtle:");
        expect(css).to.include("--color-neutral-stroke-strong-on-color-layer-fill-interactive-hover:");
        expect(css).not.to.include("--color-critical-stroke-readable-on-color-accent-fill-subtle");
    });

    it("should make a foreground of one palette on the fill of another, a pair that no treatment has", () => {
        const criticalForeground: Treatment = { properties: { foregroundFill: onFill(color.critical.stroke.readable) } };
        const accentFill: Treatment = { properties: { backgroundFill: color.accent.fill.subtle } };
        const rules = renderRules(treatmentProperties({ treatments: [accentFill, criticalForeground] }), {}, tokens);

        expect(rules[0].declarations.color).to.equal("var(--color-critical-stroke-readable-on-color-accent-fill-subtle)");
        expect(onFillCSS(library, styleRulesOnFills([{ treatments: [accentFill, criticalForeground] }]), { context: color.context })).to.match(
            /^--color-critical-stroke-readable-on-color-accent-fill-subtle:#[0-9a-f]{6};/
        );
    });

    it("should take the rest of one token and the disabled of another for an element that isn't interactive", () => {
        const rules = render(neutralDividerSubtleElementTreatment);

        expect(rules.map(rule => rule.declarations.color)).to.deep.equal([
            "var(--color-neutral-stroke-subtle)",
            "var(--color-neutral-stroke-strong-disabled)",
        ]);
    });

    it("should take the shadow of the card at rest", () => {
        expect(render(shadowCardTreatment)).to.deep.equal([{ selector: ":host", declarations: { "box-shadow": "var(--elevation-card)" } }]);
    });

    it("should apply the treatments it is composed of, and its own properties after them", () => {
        const properties = treatmentProperties(actionTreatment);

        expect(properties.get("cornerRadiusTopLeft")).to.equal(treatmentProperties(treatments.controlShapeTreatment).get("cornerRadiusTopLeft"));
        expect(render(actionTreatment)[0].declarations["border-top-color"]).to.equal("var(--color-neutral-stroke-subtle)");
    });

    it("should have the treatments of the anatomy: the disabled cursor, the focus indicator, and the focus reset", () => {
        const anatomy = { conditions: {}, parts: {}, interactivity: Interactivity.disabledAttribute, focus: Focus.contextFocused() };
        const css = formatRules(renderStyleRules([], { tokens, anatomy, treatments: referenceAnatomyTreatments }));

        expect(css).to.include(":host([disabled]) { cursor: not-allowed; }");
        expect(css).to.include(
            ":host(:focus-visible) { outline-color: var(--color-focusStroke); outline-offset: 1px; outline-style: solid; outline-width: var(--shape-strokeThickness-focus); }"
        );
    });
});
