import chai from "chai";
import { Color } from "../color.js";
import { BasePalette } from "../palette-base.js";
import { PaletteDirectionValue } from "../palette.js";
import { luminanceSwatch } from "../utilities/luminance-swatch.js";
import { contrastAndDeltaSwatchSet } from "./contrast-and-delta-swatch-set.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceSwatch(1 - i / 10));
const palette = new BasePalette(swatches[5], swatches);
const darker = PaletteDirectionValue.darker;
const lighter = PaletteDirectionValue.lighter;

// The first swatch with at least this contrast against white
const accessibleFromWhite = swatches.findIndex(s => s.contrast(swatches[0]) >= 3);

describe("contrastAndDeltaSwatchSet", (): void => {
    it("should have a rest or hover state that is the first color to meet the contrast", (): void => {
        const set = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 0, 1, 2, 3, 0, palette, darker);

        expect(set.rest).to.equal(swatches[accessibleFromWhite]);
    });

    it("should offset hover from rest by the difference of the rest and hover deltas", (): void => {
        const set = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 0, 2, 0, 0, 0, palette, darker);

        expect(set.rest).to.equal(swatches[accessibleFromWhite]);
        expect(set.hover).to.equal(swatches[accessibleFromWhite + 2]);
    });

    it("should swap rest and hover when the hover delta is lower in the darker direction", (): void => {
        const set = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 2, 0, 0, 0, 0, palette, darker);

        expect(set.hover).to.equal(swatches[accessibleFromWhite]);
        expect(set.rest).to.equal(swatches[accessibleFromWhite + 2]);
    });

    it("should offset hover in the lighter direction", (): void => {
        const set = contrastAndDeltaSwatchSet(palette, swatches[10], 3, 0, 1, 0, 0, 0, palette, lighter);
        const restIndex = palette.swatches.indexOf(set.rest!);

        expect(set.rest!.contrast(swatches[10])).to.be.gte(3);
        expect(set.hover).to.equal(swatches[restIndex - 1]);
    });

    it("should calculate active and focus from rest and disabled from the reference", (): void => {
        const set = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 0, 1, 2, 3, 1, palette, darker);
        const restIndex = palette.swatches.indexOf(set.rest!);

        expect(set.active).to.equal(swatches[restIndex + 2]);
        expect(set.focus).to.equal(swatches[restIndex + 3]);
        expect(set.disabled).to.equal(swatches[1]);
    });

    it("should use the disabled palette for the disabled state", (): void => {
        const other = new BasePalette(swatches[5], [...swatches].reverse());
        const set = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 0, 1, 2, 3, 1, other, darker);

        expect(set.disabled).to.equal(other.get(1));
    });

    it("should default the direction based on the reference", (): void => {
        const fromLight = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 0, 1, 0, 0, 0);
        const fromDark = contrastAndDeltaSwatchSet(palette, swatches[10], 3, 0, 1, 0, 0, 0);

        expect(fromLight.hover!.relativeLuminance).to.be.lessThan(fromLight.rest!.relativeLuminance);
        expect(fromDark.hover!.relativeLuminance).to.be.greaterThan(fromDark.rest!.relativeLuminance);
    });

    it("should clamp to the ends of the palette", (): void => {
        const set = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 0, 1, 50, -50, 50, palette, darker);

        expect(set.active).to.equal(swatches[10]);
        expect(set.focus).to.equal(swatches[0]);
        expect(set.disabled).to.equal(swatches[10]);
    });

    it("should accept a direction function", (): void => {
        const set = contrastAndDeltaSwatchSet(palette, swatches[0], 3, 0, 1, 0, 0, 0, palette, () => darker);

        expect(set.rest).to.equal(swatches[accessibleFromWhite]);
    });

    describe("zeroAsTransparent", (): void => {
        it("should return an invisible overlay for the state at the reference index", (): void => {
            // A contrast of 1 means the accessible color is the reference itself.
            const set = contrastAndDeltaSwatchSet(palette, swatches[3], 1, 0, 1, 0, 0, 0, palette, darker, true);

            expect(set.rest!.color.alpha).to.equal(0);
            expect(set.rest!.relativeLuminance).to.equal(swatches[3].relativeLuminance);
            expect(set.hover).to.equal(swatches[4]);
        });

        it("should return opaque swatches when not requested", (): void => {
            const set = contrastAndDeltaSwatchSet(palette, swatches[3], 1, 0, 1, 0, 0, 0, palette, darker);

            expect(set.rest).to.equal(swatches[3]);
        });
    });
});
