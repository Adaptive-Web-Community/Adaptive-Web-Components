import chai from "chai";
import { Color } from "./color.js";
import { PaletteOkhsl } from "./palette-okhsl.js";

const { expect } = chai;

const accentHex = "#0078D4";

describe("PaletteOkhsl.from", () => {
    it("should create a palette from a Color", () => {
        const color = Color.parse(accentHex)!;
        const palette = PaletteOkhsl.from(color);

        expect(palette).to.be.instanceOf(PaletteOkhsl);
        expect(palette.source).to.equal(color);
    });

    it("should create a palette from a hex string", () => {
        const palette = PaletteOkhsl.from(accentHex);

        expect(palette.source.toString()).to.equal(accentHex.toLowerCase());
    });

    it("should throw when the string cannot be parsed", () => {
        expect(() => PaletteOkhsl.from("not a color")).to.throw("Unable to parse source: not a color");
    });

    it("should have the default number of swatches", () => {
        expect(PaletteOkhsl.from(accentHex).swatches.length).to.equal(66);
    });

    it("should honor the step count", () => {
        const palette = PaletteOkhsl.from(accentHex, { stepCount: 20 });

        expect(palette.swatches.length).to.equal(20);
    });

    it("should be fixed to white and black on the ends", () => {
        const palette = PaletteOkhsl.from(accentHex);

        expect(palette.swatches[0].toString()).to.equal("#ffffff");
        expect(palette.swatches[palette.lastIndex].toString()).to.equal("#000000");
    });

    it("should progress from light to dark", () => {
        const palette = PaletteOkhsl.from(accentHex);

        for (let i = 1; i < palette.swatches.length; i++) {
            expect(
                palette.swatches[i].relativeLuminance,
                `swatch ${i} should not be lighter than ${i - 1}`
            ).to.be.lte(palette.swatches[i - 1].relativeLuminance);
        }
    });

    it("should produce greys for a grey source", () => {
        const palette = PaletteOkhsl.from("#808080");

        palette.swatches.forEach(swatch => {
            const { r, g, b } = swatch.color as any;
            expect(r).to.approximately(g, 0.01);
            expect(g).to.approximately(b, 0.01);
        });
    });

    it("should include the hue of the source in the middle of the palette", () => {
        const palette = PaletteOkhsl.from(accentHex);
        const middle = palette.get(palette.closestIndexOf(Color.parse(accentHex)!)).color as any;

        // Blue dominant
        expect(middle.b).to.be.greaterThan(middle.r);
    });

    it("should use the light and dark end saturation for a chromatic source", () => {
        const defaults = PaletteOkhsl.from(accentHex);
        const custom = PaletteOkhsl.from(accentHex, { lightEndSaturation: 0.1, darkEndSaturation: 0.1 });

        // Next to the ends, the custom palette is less saturated (closer to grey) than the default.
        const spread = (c: Color) => {
            const { r, g, b } = c.color as any;
            return Math.max(r, g, b) - Math.min(r, g, b);
        };
        expect(spread(custom.swatches[1])).to.be.lessThan(spread(defaults.swatches[1]));
        expect(spread(custom.swatches[custom.lastIndex - 1])).to.be.lessThan(
            spread(defaults.swatches[defaults.lastIndex - 1])
        );
    });

    it("should ignore the end saturation for a grey source", () => {
        const palette = PaletteOkhsl.from("#808080", { lightEndSaturation: 0.8, darkEndSaturation: 0.8 });

        palette.swatches.forEach(swatch => {
            const { r, g, b } = swatch.color as any;
            expect(Math.max(r, g, b) - Math.min(r, g, b)).to.be.lessThan(0.01);
        });
    });

    it("should handle sources near the ends of the range", () => {
        ["#fefefe", "#010101", "#ffffff", "#000000"].forEach(hex => {
            const palette = PaletteOkhsl.from(hex);

            expect(palette.swatches.length).to.be.greaterThan(60);
            palette.swatches.forEach(swatch => {
                expect(swatch.relativeLuminance, hex).not.to.be.NaN;
            });
        });
    });

    it("should accept null options", () => {
        expect(() => PaletteOkhsl.from(accentHex, null as any)).not.to.throw();
    });
});
