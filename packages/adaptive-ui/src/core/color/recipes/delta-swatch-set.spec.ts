import chai from "chai";
import { Color } from "../color.js";
import { BasePalette } from "../palette-base.js";
import { PaletteDirectionValue } from "../palette.js";
import { luminanceSwatch } from "../utilities/luminance-swatch.js";
import { deltaSwatchSet } from "./delta-swatch-set.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceSwatch(1 - i / 10));
const palette = new BasePalette(swatches[5], swatches);
const darker = PaletteDirectionValue.darker;
const lighter = PaletteDirectionValue.lighter;

describe("deltaSwatchSet", (): void => {
    it("should apply each delta from the reference in the direction", (): void => {
        const set = deltaSwatchSet(palette, swatches[2], 0, 1, 2, 3, 4, palette, darker);

        expect(set.rest).to.equal(swatches[2]);
        expect(set.hover).to.equal(swatches[3]);
        expect(set.active).to.equal(swatches[4]);
        expect(set.focus).to.equal(swatches[5]);
        expect(set.disabled).to.equal(swatches[6]);
    });

    it("should apply the deltas in the opposite direction", (): void => {
        const set = deltaSwatchSet(palette, swatches[8], 0, 1, 2, 3, 4, palette, lighter);

        expect(set.rest).to.equal(swatches[8]);
        expect(set.hover).to.equal(swatches[7]);
        expect(set.active).to.equal(swatches[6]);
        expect(set.focus).to.equal(swatches[5]);
        expect(set.disabled).to.equal(swatches[4]);
    });

    it("should default the direction based on the reference", (): void => {
        const fromLight = deltaSwatchSet(palette, swatches[1], 1, 2, 3, 4);
        const fromDark = deltaSwatchSet(palette, swatches[9], 1, 2, 3, 4);

        expect(fromLight.rest).to.equal(swatches[2]);
        expect(fromLight.focus).to.equal(swatches[5]);
        expect(fromDark.rest).to.equal(swatches[8]);
        expect(fromDark.focus).to.equal(swatches[5]);
    });

    it("should default the disabled delta to the rest delta", (): void => {
        const set = deltaSwatchSet(palette, swatches[2], 3, 4, 5, 6, undefined, palette, darker);

        expect(set.disabled).to.equal(set.rest);
        expect(set.disabled).to.equal(swatches[5]);
    });

    it("should use the disabled palette for the disabled state only", (): void => {
        const other = new BasePalette(swatches[5], [...swatches].reverse());
        const set = deltaSwatchSet(palette, swatches[2], 1, 1, 1, 1, 1, other, darker);

        expect(set.rest).to.equal(swatches[3]);
        expect(set.disabled).to.equal(other.get(palette.closestIndexOf(swatches[2]) + 1));
        expect(set.disabled).not.to.equal(set.rest);
    });

    it("should clamp to the ends of the palette", (): void => {
        const set = deltaSwatchSet(palette, swatches[8], 1, 5, 10, 20, 30, palette, darker);

        expect(set.rest).to.equal(swatches[9]);
        expect(set.hover).to.equal(swatches[10]);
        expect(set.active).to.equal(swatches[10]);
        expect(set.focus).to.equal(swatches[10]);
        expect(set.disabled).to.equal(swatches[10]);
    });

    it("should accept a direction function", (): void => {
        const set = deltaSwatchSet(palette, swatches[5], 1, 1, 1, 1, 1, palette, () => lighter);

        expect(set.rest).to.equal(swatches[4]);
    });

    describe("zeroAsTransparent", (): void => {
        it("should return opaque swatches by default for a delta of zero", (): void => {
            const set = deltaSwatchSet(palette, swatches[2], 0, 1, 0, 1, 0, palette, darker);

            expect(set.rest).to.equal(swatches[2]);
            expect(set.active).to.equal(swatches[2]);
            expect(set.disabled).to.equal(swatches[2]);
        });

        it("should return an overlay for states with a delta of zero", (): void => {
            const set = deltaSwatchSet(palette, swatches[2], 0, 1, 0, 1, 0, palette, darker, true);

            [set.rest, set.active, set.disabled].forEach(color => {
                // The color is the reference over itself, so it's invisible (alpha 0)
                expect(color).not.to.equal(swatches[2]);
                expect(color!.color.alpha).to.equal(0);
                expect(color!.relativeLuminance).to.equal(swatches[2].relativeLuminance);
            });
        });

        it("should not change states with a non-zero delta", (): void => {
            const set = deltaSwatchSet(palette, swatches[2], 0, 1, 0, 2, 0, palette, darker, true);

            expect(set.hover).to.equal(swatches[3]);
            expect(set.focus).to.equal(swatches[4]);
        });
    });
});
