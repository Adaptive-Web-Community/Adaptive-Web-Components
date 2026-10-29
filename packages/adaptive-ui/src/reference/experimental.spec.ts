import chai from "chai";
import { hex, toCSS } from "design-token-library";
import { formatPaint } from "../core/color/paint.js";
import { hueShiftGradient } from "../core/color/recipes/hue-shift-gradient.js";
import { twoPaletteGradient } from "../core/color/recipes/two-palette-gradient.js";
import { Interactivity } from "../core/styles/anatomy.js";
import { formatRules, libraryTokenProperties, renderRules } from "../core/styles/css/rules.js";
import { treatmentProperties } from "../core/styles/treatment.js";
import { adaptiveConverters } from "../core/token-css.js";
import { getIntendedFor } from "../core/token-metadata.js";
import { StyleProperty } from "../core/styles/properties.js";
import { accentHueShiftGradientFillSubtleElementTreatment, accentToHighlightGradientFillSubtleElementTreatment } from "./experimental.js";
import { createReferenceLibrary } from "./library.js";

const { expect } = chai;

describe("the experimental tokens", () => {
    it("should have the names they had", () => {
        const { color } = createReferenceLibrary().tokens;

        expect(color.gradient.angle.name).to.equal("color.gradient.angle");
        expect(color.gradient.startShift.name).to.equal("color.gradient.startShift");
        expect(color.gradient.endShift.name).to.equal("color.gradient.endShift");
        expect(color.accentHueShiftGradient.fill.subtle.name).to.equal("color.accentHueShiftGradient.fill.subtle");
        expect(color.accentToHighlightGradient.fill.subtle.name).to.equal("color.accentToHighlightGradient.fill.subtle");
    });

    it("should have the angle of 0.14, and shift the hue the other way at the start", () => {
        const { gradient } = createReferenceLibrary().tokens.color;

        expect([gradient.angle.$value, gradient.startShift.$value, gradient.endShift.$value]).to.deep.equal([180, -15, 15]);
    });

    it("should be the gradients of the recipes, at the delta of the subtle fill at rest, in the color context", () => {
        for (const context of [hex("#ffffff"), hex("#1a1a1a")]) {
            const library = createReferenceLibrary();
            library.tokens.color.context.set(context);
            const { color } = library.tokens;
            const delta = color.deltas.fill.subtle.rest.$value;

            expect(color.accentHueShiftGradient.fill.subtle.$value).to.deep.equal(
                hueShiftGradient(color.accent.palette.$value, context, delta, { angle: 180, startShift: -15, endShift: 15 })
            );
            expect(color.accentToHighlightGradient.fill.subtle.$value).to.deep.equal(
                twoPaletteGradient(color.accent.palette.$value, color.highlight.palette.$value, context, delta, { angle: 180 })
            );
        }
    });

    it("should follow the angle and the shifts", () => {
        const library = createReferenceLibrary();
        const { color } = library.tokens;
        const before = formatPaint(color.accentHueShiftGradient.fill.subtle.$value);

        color.gradient.angle.set(90);
        expect(formatPaint(color.accentHueShiftGradient.fill.subtle.$value)).to.match(/^linear-gradient\(90deg, /);
        expect(formatPaint(color.accentToHighlightGradient.fill.subtle.$value)).to.match(/^linear-gradient\(90deg, /);
        color.gradient.angle.set(180);
        color.gradient.startShift.set(0);
        expect(formatPaint(color.accentHueShiftGradient.fill.subtle.$value)).not.to.equal(before);
    });

    it("should be intended for the background, and written to CSS as a gradient", () => {
        const library = createReferenceLibrary();
        const { color } = library.tokens;
        const css = toCSS(library, { converters: adaptiveConverters(library) });

        expect(getIntendedFor(color.accentHueShiftGradient.fill.subtle)).to.deep.equal([StyleProperty.backgroundFill]);
        expect(css).to.include(`--color-accentHueShiftGradient-fill-subtle:${formatPaint(color.accentHueShiftGradient.fill.subtle.$value)};`);
        expect(css).to.match(/--color-accentToHighlightGradient-fill-subtle:linear-gradient\(180deg, #[0-9a-f]{6} 0%, #[0-9a-f]{6} 100%\);/);
        expect(css).to.include("--color-gradient-angle:180;");
    });
});

describe("the experimental treatments", () => {
    const tokens = libraryTokenProperties(createReferenceLibrary());
    const render = (treatment: typeof accentHueShiftGradientFillSubtleElementTreatment) =>
        formatRules(renderRules(treatmentProperties(treatment), Interactivity.disabledAttribute, tokens)).split("\n");

    it("should have the gradient at rest and the disabled fill when disabled, with the border", () => {
        const css = render(accentHueShiftGradientFillSubtleElementTreatment);

        expect(css[0]).to.match(/^:host \{ background: var\(--color-accentHueShiftGradient-fill-subtle\); border-top-width: /);
        expect(css[0]).to.include("border-top-color: var(--color-accent-stroke-safety);");
        expect(css[css.length - 1]).to.match(/^:host\(\[disabled\]\) \{ background: var\(--color-neutral-fill-subtle-disabled\);/);
        expect(render(accentToHighlightGradientFillSubtleElementTreatment)[0]).to.match(
            /^:host \{ background: var\(--color-accentToHighlightGradient-fill-subtle\);/
        );
    });

    it("should have the names they had", () => {
        expect(accentHueShiftGradientFillSubtleElementTreatment.name).to.equal("color.accent-hue-shift-gradient-fill-subtle-element");
        expect(accentToHighlightGradientFillSubtleElementTreatment.name).to.equal("color.accent-to-highlight-gradient-fill-subtle-element");
    });
});
