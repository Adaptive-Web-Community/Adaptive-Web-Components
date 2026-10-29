import chai from "chai";
import { Color, colorLuminance, parseColor, rgbColor } from "./color.js";
import { closestSwatchIndex, createPalette, Palette, PaletteDirection, reversedSwatches, swatchAt } from "./palette.js";
import { luminanceColor } from "./utilities/luminance-color.js";
import { linearGradient } from "./gradient.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceColor(1 - i / 10));
const source = swatches[5];

describe("PaletteDirection", () => {
    it("should be 1 for darker and -1 for lighter", () => {
        expect(PaletteDirection.darker).to.equal(1);
        expect(PaletteDirection.lighter).to.equal(-1);
    });

    it("should be immutable", () => {
        expect(Object.isFrozen(PaletteDirection)).to.be.true;
    });
});

describe("Palette", () => {
    let palette: Palette;

    beforeEach(() => {
        palette = createPalette(source, swatches);
    });

    describe("createPalette", () => {
        it("should store the source and swatches", () => {
            expect(palette.source).to.equal(source);
            expect(palette.swatches).to.deep.equal(swatches);
        });

        it("should be frozen, and copy the swatches", () => {
            expect(Object.isFrozen(palette)).to.be.true;
            expect(Object.isFrozen(palette.swatches)).to.be.true;
            expect(palette.swatches).not.to.equal(swatches);
            expect(Object.isFrozen(swatches)).to.be.false;
        });

        it("should be plain data", () => {
            expect(JSON.parse(JSON.stringify(palette))).to.deep.equal({
                source: { colorSpace: "srgb", components: [0.5, 0.5, 0.5] },
                swatches: swatches.map(swatch => ({ colorSpace: "srgb", components: swatch.components })),
            });
        });
    });

    describe("reversedSwatches", () => {
        it("should be a frozen copy in reverse order without changing the original order", () => {
            const reversed = reversedSwatches(palette);

            expect(reversed[0]).to.equal(swatches[10]);
            expect(reversed[10]).to.equal(swatches[0]);
            expect(palette.swatches[0]).to.equal(swatches[0]);
            expect(Object.isFrozen(reversed)).to.be.true;
        });

        it("should be the same array every time", () => {
            expect(reversedSwatches(palette)).to.equal(reversedSwatches(palette));
        });
    });

    describe("swatchAt", () => {
        it("should return the swatch at the index", () => {
            expect(swatchAt(palette, 0)).to.equal(swatches[0]);
            expect(swatchAt(palette, 4)).to.equal(swatches[4]);
            expect(swatchAt(palette, 10)).to.equal(swatches[10]);
        });

        it("should clamp to the first swatch for negative indexes", () => {
            expect(swatchAt(palette, -1)).to.equal(swatches[0]);
            expect(swatchAt(palette, -100)).to.equal(swatches[0]);
        });

        it("should clamp to the last swatch for indexes beyond the end", () => {
            expect(swatchAt(palette, 11)).to.equal(swatches[10]);
            expect(swatchAt(palette, 100)).to.equal(swatches[10]);
        });

        it("should round a fractional index to the nearest swatch", () => {
            expect(swatchAt(palette, 2.4)).to.equal(swatches[2]);
            expect(swatchAt(palette, 2.6)).to.equal(swatches[3]);
            expect(swatchAt(palette, -0.4)).to.equal(swatches[0]);
            expect(swatchAt(palette, 10.4)).to.equal(swatches[10]);
        });

        it("should clamp NaN to the first swatch", () => {
            expect(swatchAt(palette, Number.NaN)).to.equal(swatches[0]);
        });
    });

    describe("closestSwatchIndex", () => {
        it("should return the index of a swatch in the palette", () => {
            expect(closestSwatchIndex(palette, swatches[3])).to.equal(3);
        });

        it("should return the index of the swatch with the nearest luminance", () => {
            const near = (index: number, offset: number) => luminanceColor(1 - index / 10 + offset);

            expect(closestSwatchIndex(palette, near(3, 0.001))).to.equal(3);
            expect(closestSwatchIndex(palette, near(3, -0.001))).to.equal(3);
        });

        it("should return the end indexes for luminance outside the palette", () => {
            expect(closestSwatchIndex(palette, rgbColor(5, 5, 5))).to.equal(0);
            expect(closestSwatchIndex(palette, rgbColor(-5, -5, -5))).to.equal(10);
        });

        it("should find an equivalent color that is not in the palette", () => {
            expect(closestSwatchIndex(palette, rgbColor(0.5, 0.5, 0.5))).to.equal(
                closestSwatchIndex(palette, luminanceColor(0.5))
            );
        });

        it("should use the first stop of a gradient", () => {
            const gradient = linearGradient([
                { color: swatches[7], position: { value: 0, unit: "%" } },
                { color: swatches[2], position: { value: 1, unit: "%" } },
            ]);

            expect(closestSwatchIndex(palette, gradient)).to.equal(7);
        });

        it("should return the same index when asked again", () => {
            const color = parseColor("#808080")!;
            const index = closestSwatchIndex(palette, color);

            expect(closestSwatchIndex(palette, color)).to.equal(index);
            expect(closestSwatchIndex(palette, parseColor("#808080")!)).to.equal(index);
        });

        it("should be unaffected by another palette", () => {
            const other = createPalette(source, [...swatches].reverse());
            const color = swatches[3];

            expect(closestSwatchIndex(palette, color)).to.equal(3);
            expect(closestSwatchIndex(other, color)).to.equal(7);
            expect(closestSwatchIndex(palette, color)).to.equal(3);
        });

        it("should use the first swatch when the luminance is unknown", () => {
            expect(colorLuminance(rgbColor(0.5, 0.5, 0.5, 0.5))).to.be.NaN;
            expect(closestSwatchIndex(palette, rgbColor(0.5, 0.5, 0.5, 0.5))).to.equal(0);
        });
    });
});
