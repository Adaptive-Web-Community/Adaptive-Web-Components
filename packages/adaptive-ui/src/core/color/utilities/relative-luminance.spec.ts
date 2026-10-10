import chai from "chai";
import { Color } from "../color.js";
import { _black, _white } from "./color-constants.js";
import { luminanceSwatch } from "./luminance-swatch.js";
import { contrast } from "./relative-luminance.js";

const { expect } = chai;

describe("contrast", () => {
    it("should be 21 between black and white", () => {
        expect(contrast(_black, _white)).to.approximately(21, 0.0001);
    });

    it("should be 1 between identical colors", () => {
        expect(contrast(_white, _white)).to.equal(1);
        expect(contrast(_black, _black)).to.equal(1);
    });

    it("should be symmetric", () => {
        const grey = Color.parse("#767676")!;

        expect(contrast(grey, _white)).to.equal(contrast(_white, grey));
    });

    it("should be 4.54 between #767676 and white", () => {
        expect(contrast(Color.parse("#767676")!, _white)).to.approximately(4.54, 0.01);
    });

    it("should use the formula for plain relative luminance values", () => {
        const a = { relativeLuminance: 0.5, contrast: () => 0 };
        const b = { relativeLuminance: 0.05, contrast: () => 0 };

        expect(contrast(a, b)).to.approximately(5.5, 0.0001);
    });
});

describe("luminanceSwatch", () => {
    it("should create black and white for 0 and 1", () => {
        expect(luminanceSwatch(0).toString()).to.equal("#000000");
        expect(luminanceSwatch(1).toString()).to.equal("#ffffff");
    });

    it("should create a grey for the luminance", () => {
        const swatch = luminanceSwatch(0.5);

        expect(swatch).to.be.instanceOf(Color);
        expect(swatch.toString()).to.equal("#808080");
    });
});
