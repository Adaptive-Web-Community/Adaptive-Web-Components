import chai from "chai";
import { Color } from "../color.js";
import { PaletteDirectionValue } from "../palette.js";
import { directionByIsDark } from "./direction-by-is-dark.js";
import { isDark } from "./is-dark.js";
import { _black, _white } from "./color-constants.js";

const { expect } = chai;

describe("isDark", () => {
    it("should treat black as dark and white as light", () => {
        expect(isDark(_black)).to.be.true;
        expect(isDark(_white)).to.be.false;
    });

    it("should treat #757575 (the darkest grey with 4.5:1 against white) as dark", () => {
        expect(isDark(Color.parse("#757575")!)).to.be.true;
    });

    it("should treat #777777 (just lighter than the threshold) as light", () => {
        expect(isDark(Color.parse("#777777")!)).to.be.false;
    });

    it("should be the point of equal contrast against black and white", () => {
        const dark = Color.parse("#757575")!;
        const light = Color.parse("#777777")!;

        expect(dark.contrast(_white)).to.be.gte(dark.contrast(_black));
        expect(light.contrast(_white)).to.be.lessThan(light.contrast(_black));
    });

    it("should only require a relativeLuminance", () => {
        const luminance = { relativeLuminance: 0.1, contrast: () => 1 };

        expect(isDark(luminance)).to.be.true;
        expect(isDark({ ...luminance, relativeLuminance: 0.5 })).to.be.false;
    });
});

describe("directionByIsDark", () => {
    it("should move lighter from a dark color", () => {
        expect(directionByIsDark(_black)).to.equal(PaletteDirectionValue.lighter);
    });

    it("should move darker from a light color", () => {
        expect(directionByIsDark(_white)).to.equal(PaletteDirectionValue.darker);
    });
});
