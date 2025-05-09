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
