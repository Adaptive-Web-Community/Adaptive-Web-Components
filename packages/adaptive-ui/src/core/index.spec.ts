import chai from "chai";
import * as core from "./index.js";

const { expect } = chai;

describe("core index", () => {
    it("should export the public api", () => {
        [
            "rgbColor",
            "parseColor",
            "createPaletteRGB",
            "createPaletteOkhsl",
            "linearGradient",
            "Interactivity",
            "StyleProperty",
            "DesignTokenType",
            "TypedCSSDesignToken",
            "TypedDesignToken",
            "DensityPaddingAndGapTokenGroup",
            "typeScale",
            "AdaptiveDesignToken",
            "evaluate",
            "adaptiveConverters",
            "createTokenColor",
            "contrastColor",
            "blackOrWhiteByContrast",
        ].forEach(name => {
            expect(core, name).to.have.property(name);
        });
    });
});
