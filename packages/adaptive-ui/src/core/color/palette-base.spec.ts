import chai from "chai";
import { Color } from "./color.js";
import { BasePalette } from "./palette-base.js";
import { PaletteDirectionValue } from "./palette.js";
import { luminanceSwatch } from "./utilities/luminance-swatch.js";
import { _black, _white } from "./utilities/color-constants.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceSwatch(1 - i / 10));
const source = swatches[5];

describe("BasePalette", () => {
    let palette: BasePalette;

    beforeEach(() => {
        palette = new BasePalette(source, swatches);
    });

    describe("constructor", () => {
        it("should store the source and swatches", () => {
            expect(palette.source).to.equal(source);
            expect(palette.swatches).to.equal(swatches);
        });

        it("should calculate the last index", () => {
            expect(palette.lastIndex).to.equal(10);
        });

        it("should create a frozen reversed copy without changing the original order", () => {
            expect(palette.reversedSwatches[0]).to.equal(swatches[10]);
            expect(palette.reversedSwatches[10]).to.equal(swatches[0]);
            expect(palette.swatches[0]).to.equal(swatches[0]);
            expect(Object.isFrozen(palette.reversedSwatches)).to.be.true;
        });
    });

    describe("get", () => {
        it("should return the swatch at the index", () => {
            expect(palette.get(0)).to.equal(swatches[0]);
            expect(palette.get(4)).to.equal(swatches[4]);
            expect(palette.get(10)).to.equal(swatches[10]);
        });

        it("should clamp to the first swatch for negative indexes", () => {
            expect(palette.get(-1)).to.equal(swatches[0]);
            expect(palette.get(-100)).to.equal(swatches[0]);
        });

        it("should clamp to the last swatch for indexes beyond the end", () => {
            expect(palette.get(11)).to.equal(swatches[10]);
            expect(palette.get(100)).to.equal(swatches[10]);
        });

        it("should round a fractional index to the nearest swatch", () => {
            expect(palette.get(2.4)).to.equal(swatches[2]);
            expect(palette.get(2.6)).to.equal(swatches[3]);
            expect(palette.get(-0.4)).to.equal(swatches[0]);
            expect(palette.get(10.4)).to.equal(swatches[10]);
        });

        it("should clamp NaN to the first swatch", () => {
            expect(palette.get(Number.NaN)).to.equal(swatches[0]);
        });
    });

    describe("closestIndexOf", () => {
        it("should return the index of a swatch in the palette", () => {
            expect(palette.closestIndexOf(swatches[3])).to.equal(3);
        });

        it("should return the index of the swatch with the nearest luminance", () => {
            const near = (index: number, offset: number) =>
                ({ relativeLuminance: swatches[index].relativeLuminance + offset, contrast: () => 1 });

            expect(palette.closestIndexOf(near(3, 0.001))).to.equal(3);
            expect(palette.closestIndexOf(near(3, -0.001))).to.equal(3);
        });

        it("should return the end indexes for luminance outside the palette", () => {
            expect(palette.closestIndexOf({ relativeLuminance: 5, contrast: () => 1 })).to.equal(0);
            expect(palette.closestIndexOf({ relativeLuminance: -5, contrast: () => 1 })).to.equal(10);
        });

        it("should find an equivalent color that is not in the palette", () => {
            expect(palette.closestIndexOf(Color.fromRgb(0.5, 0.5, 0.5))).to.equal(
                palette.closestIndexOf(luminanceSwatch(0.5))
            );
        });

        it("should cache results by relative luminance", () => {
            const color = Color.fromRgb(0.5, 0.5, 0.5);
            const luminance = color.relativeLuminance;

            expect(palette.closestIndexCache.has(luminance)).to.be.false;

            const index = palette.closestIndexOf(color);

            expect(palette.closestIndexCache.get(luminance)).to.equal(index);
            expect(palette.closestIndexOf(color)).to.equal(index);
        });

        it("should return the cached index for a swatch in the palette", () => {
            palette.closestIndexOf(swatches[3]);

            expect(palette.closestIndexCache.get(swatches[3].relativeLuminance)).to.equal(3);
        });
    });

    describe("delta", () => {
        it("should move toward darker swatches (higher index) with the darker direction", () => {
            expect(palette.delta(swatches[3], 2, PaletteDirectionValue.darker)).to.equal(swatches[5]);
        });

        it("should move toward lighter swatches (lower index) with the lighter direction", () => {
            expect(palette.delta(swatches[3], 2, PaletteDirectionValue.lighter)).to.equal(swatches[1]);
        });

        it("should return the reference swatch with a delta of zero", () => {
            expect(palette.delta(swatches[3], 0, PaletteDirectionValue.darker)).to.equal(swatches[3]);
        });

        it("should invert when the delta is negative", () => {
            expect(palette.delta(swatches[3], -2, PaletteDirectionValue.darker)).to.equal(swatches[1]);
        });

        it("should round a fractional delta to a swatch", () => {
            expect(palette.delta(swatches[3], 1.5, PaletteDirectionValue.darker)).to.equal(swatches[5]);
            expect(palette.delta(swatches[3], 1.4, PaletteDirectionValue.darker)).to.equal(swatches[4]);
        });

        it("should clamp at the ends of the palette", () => {
            expect(palette.delta(swatches[8], 5, PaletteDirectionValue.darker)).to.equal(swatches[10]);
            expect(palette.delta(swatches[2], 5, PaletteDirectionValue.lighter)).to.equal(swatches[0]);
        });

        it("should support a direction function", () => {
            expect(palette.delta(swatches[3], 1, () => PaletteDirectionValue.darker)).to.equal(swatches[4]);
        });
    });

    describe("colorContrast", () => {
        it("should find the nearest darker swatch that meets the contrast", () => {
            const result = palette.colorContrast(_white, 3, undefined, PaletteDirectionValue.darker);

            expect(result.contrast(_white)).to.be.gte(3);
            // The previous swatch does not meet the contrast
            const index = palette.swatches.indexOf(result);
            expect(palette.swatches[index - 1].contrast(_white)).to.be.lessThan(3);
        });

        it("should find the nearest lighter swatch that meets the contrast", () => {
            const result = palette.colorContrast(_black, 3, undefined, PaletteDirectionValue.lighter);

            expect(result.contrast(_black)).to.be.gte(3);
            const index = palette.swatches.indexOf(result);
            expect(palette.swatches[index + 1].contrast(_black)).to.be.lessThan(3);
        });

        it("should default the direction to away from the reference based on whether it is dark", () => {
            expect(palette.colorContrast(_white, 3)).to.equal(
                palette.colorContrast(_white, 3, undefined, PaletteDirectionValue.darker)
            );
            expect(palette.colorContrast(_black, 3)).to.equal(
                palette.colorContrast(_black, 3, undefined, PaletteDirectionValue.lighter)
            );
        });

        it("should return the end of the palette when the contrast cannot be met", () => {
            expect(palette.colorContrast(_white, 100, undefined, PaletteDirectionValue.darker)).to.equal(swatches[10]);
            expect(palette.colorContrast(_black, 100, undefined, PaletteDirectionValue.lighter)).to.equal(swatches[0]);
        });

        it("should begin searching from the provided initial index", () => {
            // Contrast of 1 is met by every swatch, so the result is the swatch at the start of the search.
            expect(palette.colorContrast(_white, 1, 4, PaletteDirectionValue.darker)).to.equal(swatches[4]);
            expect(palette.colorContrast(_white, 1, 4, PaletteDirectionValue.lighter)).to.equal(swatches[4]);
        });

        it("should accept an initial index of zero", () => {
            expect(palette.colorContrast(_white, 1, 0, PaletteDirectionValue.darker)).to.equal(swatches[0]);
        });

        it("should accept a direction function", () => {
            expect(palette.colorContrast(_white, 3, undefined, () => PaletteDirectionValue.darker)).to.equal(
                palette.colorContrast(_white, 3, undefined, PaletteDirectionValue.darker)
            );
        });
    });
});
