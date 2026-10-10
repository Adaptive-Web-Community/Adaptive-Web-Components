import chai from "chai";
import * as core from "./index.js";

const { expect } = chai;

describe("core index", () => {
    it("should export the public api", () => {
        [
            "Color",
            "Swatch",
            "PaletteRGB",
            "PaletteOkhsl",
            "LinearGradient",
            "Styles",
            "ElementStylesRenderer",
            "Interactivity",
            "StyleProperty",
            "DesignTokenType",
            "TypedCSSDesignToken",
            "TypedDesignToken",
            "DensityPaddingAndGapTokenGroup",
            "TypeScaleTokenGroup",
            "Shadow",
            "createTokenColor",
            "createTokenColorSet",
            "contrastSwatch",
            "blackOrWhiteByContrast",
        ].forEach(name => {
            expect(core, name).to.have.property(name);
        });
    });
});
