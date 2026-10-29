import chai from "chai";
import { Color, formatColor, parseColor } from "./color.js";
import { createPaletteOkhsl, stepCountFor } from "./palette-okhsl.js";
import { closestSwatchIndex, swatchAt } from "./palette.js";
import { relativeLuminance } from "./utilities/relative-luminance.js";

const { expect } = chai;

const accentHex = "#0078D4";

describe("createPaletteOkhsl", () => {
    it("should create a palette from a Color", () => {
        const color = parseColor(accentHex)!;
        const palette = createPaletteOkhsl(color);

        expect(palette.source).to.equal(color);
    });

    it("should create a palette from a hex string", () => {
        const palette = createPaletteOkhsl(accentHex);

        expect(formatColor(palette.source)).to.equal(accentHex.toLowerCase());
    });

    it("should throw when the string cannot be parsed", () => {
        expect(() => createPaletteOkhsl("not a color")).to.throw("Unable to parse source: not a color");
    });

    it("should have the default number of swatches", () => {
        expect(createPaletteOkhsl(accentHex).swatches.length).to.equal(66);
    });

    it("should honor the step count", () => {
        const palette = createPaletteOkhsl(accentHex, { stepCount: 20 });

        expect(palette.swatches.length).to.equal(20);
    });

    it("should be fixed to white and black on the ends", () => {
        const palette = createPaletteOkhsl(accentHex);

        expect(formatColor(palette.swatches[0])).to.equal("#ffffff");
        expect(formatColor(palette.swatches[(palette.swatches.length - 1)])).to.equal("#000000");
    });

    it("should progress from light to dark", () => {
        const palette = createPaletteOkhsl(accentHex);

        for (let i = 1; i < palette.swatches.length; i++) {
            expect(
                relativeLuminance(palette.swatches[i]),
                `swatch ${i} should not be lighter than ${i - 1}`
            ).to.be.lte(relativeLuminance(palette.swatches[i - 1]));
        }
    });

    it("should produce greys for a grey source", () => {
        const palette = createPaletteOkhsl("#808080");

        palette.swatches.forEach(swatch => {
            const [r, g, b] = swatch.components as readonly number[];
            expect(r).to.approximately(g, 0.01);
            expect(g).to.approximately(b, 0.01);
        });
    });

    it("should include the hue of the source in the middle of the palette", () => {
        const palette = createPaletteOkhsl(accentHex);
        const [r, , b] = swatchAt(palette, closestSwatchIndex(palette, parseColor(accentHex)!)).components as readonly number[];

        // Blue dominant
        expect(b).to.be.greaterThan(r);
    });

    it("should use the light and dark end saturation for a chromatic source", () => {
        const defaults = createPaletteOkhsl(accentHex);
        const custom = createPaletteOkhsl(accentHex, { lightEndSaturation: 0.1, darkEndSaturation: 0.1 });

        // Next to the ends, the custom palette is less saturated (closer to grey) than the default.
        const spread = (c: Color) => {
            const [r, g, b] = c.components as readonly number[];
            return Math.max(r, g, b) - Math.min(r, g, b);
        };
        expect(spread(custom.swatches[1])).to.be.lessThan(spread(defaults.swatches[1]));
        expect(spread(custom.swatches[(custom.swatches.length - 1) - 1])).to.be.lessThan(
            spread(defaults.swatches[(defaults.swatches.length - 1) - 1])
        );
    });

    it("should ignore the end saturation for a grey source", () => {
        const palette = createPaletteOkhsl("#808080", { lightEndSaturation: 0.8, darkEndSaturation: 0.8 });

        palette.swatches.forEach(swatch => {
            const [r, g, b] = swatch.components as readonly number[];
            expect(Math.max(r, g, b) - Math.min(r, g, b)).to.be.lessThan(0.01);
        });
    });

    it("should handle sources near the ends of the range", () => {
        ["#fefefe", "#010101", "#ffffff", "#000000"].forEach(hex => {
            const palette = createPaletteOkhsl(hex);

            expect(palette.swatches.length).to.be.greaterThan(60);
            palette.swatches.forEach(swatch => {
                expect(relativeLuminance(swatch), hex).not.to.be.NaN;
            });
        });
    });

    it("should accept null options", () => {
        expect(() => createPaletteOkhsl(accentHex, null as any)).not.to.throw();
    });
});

describe("stepCountFor", () => {
    it("should be the number of swatches that have a step of points of lightness on a scale of 100, to a whole number", () => {
        expect(stepCountFor(1.5)).to.equal(66);
        expect(stepCountFor(1)).to.equal(100);
        expect(stepCountFor(2)).to.equal(50);
        expect(stepCountFor(7)).to.equal(14);
    });

    it("should give the palette that has the number of swatches", () => {
        expect(createPaletteOkhsl(accentHex, { stepCount: stepCountFor(1.5) }).swatches.length).to.equal(66);
    });
});
