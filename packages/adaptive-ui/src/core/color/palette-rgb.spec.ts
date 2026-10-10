import chai from "chai";
import { Color } from "./color.js";
import { PaletteRGB, PaletteRGBOptions } from "./palette-rgb.js";
import { contrast } from "./utilities/relative-luminance.js";

const { expect } = chai;

const greyHex = "#808080";
const greyColor = Color.parse(greyHex)!;

describe("PaletteRGB.from", () => {
    it("should create a palette from the provided Color", () => {
        const palette = PaletteRGB.from(greyColor);

        expect(palette.source).to.equal(greyColor);
    });

    it("should create a palette from the provided hex color", () => {
        const palette = PaletteRGB.from(greyHex);

        expect(palette.source.toColorString()).to.equal(greyHex);
    });

    it("should create a palette with increased contrast", () => {
        const options: Partial<PaletteRGBOptions> = {
            stepContrast: 1.07,
            stepContrastRamp: 0,
        };
        const palette = PaletteRGB.from(greyColor, options);

        expect(contrast(palette.swatches[0], palette.swatches[1]), "at least 1.07:1 between 0 and 1").to.be.gte(1.07);
        expect(contrast(palette.swatches[20], palette.swatches[21]), "at least 1.07:1 between 20 and 21").to.be.gte(
            1.07
        );
    });

    it("should throw when the string cannot be parsed", () => {
        expect(() => PaletteRGB.from("not a color")).to.throw("Unable to parse Color as hex string: not a color");
    });

    it("should start with white and end with black for a grey source", () => {
        const palette = PaletteRGB.from(greyColor);

        expect(palette.swatches[0].toString()).to.equal("#ffffff");
        expect(palette.swatches[palette.lastIndex].toString()).to.equal("#000000");
    });

    it("should progress from light to dark", () => {
        const palette = PaletteRGB.from("#0078D4");

        for (let i = 1; i < palette.swatches.length; i++) {
            expect(
                palette.swatches[i].relativeLuminance,
                `swatch ${i} should be darker than ${i - 1}`
            ).to.be.lessThan(palette.swatches[i - 1].relativeLuminance);
        }
    });

    it("should maintain at least the step contrast between every swatch", () => {
        const palette = PaletteRGB.from("#0078D4");

        for (let i = 1; i < palette.swatches.length; i++) {
            expect(contrast(palette.swatches[i - 1], palette.swatches[i]), `between ${i - 1} and ${i}`).to.be.gte(1.05);
        }
    });

    it("should create fewer swatches with a larger step contrast", () => {
        const fine = PaletteRGB.from(greyColor, { stepContrast: 1.05 });
        const coarse = PaletteRGB.from(greyColor, { stepContrast: 1.2 });

        expect(coarse.swatches.length).to.be.lessThan(fine.swatches.length);
    });

    it("should increase contrast for darker swatches with a step contrast ramp", () => {
        const flat = PaletteRGB.from(greyColor, { stepContrast: 1.05, stepContrastRamp: 0 });
        const ramped = PaletteRGB.from(greyColor, { stepContrast: 1.05, stepContrastRamp: 0.5 });
        const last = (p: PaletteRGB) => contrast(p.swatches[p.lastIndex - 1], p.swatches[p.lastIndex - 2]);

        expect(ramped.swatches.length).to.be.lessThan(flat.swatches.length);
        expect(last(ramped)).to.be.greaterThan(last(flat));
    });

    it("should use the default options when options are not provided", () => {
        const withoutOptions = PaletteRGB.from(greyColor);
        const withEmptyOptions = PaletteRGB.from(greyColor, {});

        expect(withEmptyOptions.swatches.map(s => s.toString())).to.deep.equal(
            withoutOptions.swatches.map(s => s.toString())
        );
    });

    it("should freeze the swatches", () => {
        expect(Object.isFrozen(PaletteRGB.from(greyColor).swatches)).to.be.true;
    });

    it("should contain the hue of the source", () => {
        const palette = PaletteRGB.from("#0078D4");
        const mid = palette.swatches[Math.floor(palette.swatches.length / 2)].color as any;

        expect(mid.b).to.be.greaterThan(mid.r);
    });

    it("should create a palette for white and black sources", () => {
        ["#ffffff", "#000000"].forEach(hex => {
            const palette = PaletteRGB.from(hex);

            expect(palette.swatches.length, hex).to.be.greaterThan(10);
            expect(palette.swatches[0].toString(), hex).to.equal("#ffffff");
            expect(palette.swatches[palette.lastIndex].toString(), hex).to.equal("#000000");
        });
    });

    describe("preserveSource", () => {
        ["#808080", "#0078D4", "#D83B01", "#5C2D91", "#404040", "#c0c0c0"].forEach(hex => {
            it(`should include the source color ${hex} in the palette`, () => {
                const source = Color.parse(hex)!;
                const palette = PaletteRGB.from(source, { preserveSource: true });

                expect(palette.swatches).to.include(source);
            });

            it(`should span white to black for ${hex}`, () => {
                const palette = PaletteRGB.from(hex, { preserveSource: true });

                expect(palette.swatches[0].toString()).to.equal("#ffffff");
                expect(palette.swatches[palette.lastIndex].toString()).to.equal("#000000");
            });

            it(`should progress from light to dark for ${hex}`, () => {
                const palette = PaletteRGB.from(hex, { preserveSource: true });

                for (let i = 1; i < palette.swatches.length; i++) {
                    expect(palette.swatches[i].relativeLuminance, `swatch ${i}`).to.be.lessThan(
                        palette.swatches[i - 1].relativeLuminance
                    );
                }
            });
        });

        it("should keep nearly the step contrast between swatches", () => {
            const palette = PaletteRGB.from("#0078D4", { preserveSource: true });

            for (let i = 1; i < palette.swatches.length; i++) {
                expect(contrast(palette.swatches[i - 1], palette.swatches[i]), `between ${i - 1} and ${i}`).to.be.gte(1.04);
            }
        });
    });

    // TODO: Fix with https://github.com/microsoft/fast/issues/5852
    // it("should create a palette with preserved source", () => {
    //     const options: Partial<PaletteRGBOptions> = {
    //             preserveSource: true,
    //     };
    //     const palette = PaletteRGB.from(greySwatch, options);

    //     expect(contrast(palette.swatches[0], palette.swatches[1]), "at least 1.05:1 between 0 and 1").to.be.gte(1.05);
    //     expect(contrast(palette.swatches[20], palette.swatches[21]), "at least 1.05:1 between 0 and 1").to.be.gte(1.05);
    // });
});
