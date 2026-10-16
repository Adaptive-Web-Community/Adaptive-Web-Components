import chai from "chai";
import { parseColor } from "../color.js";
import { PaletteDirection } from "../palette.js";
import { black, white } from "./color-constants.js";
import { directionByIsDark } from "./direction-by-is-dark.js";
import { isDark } from "./is-dark.js";
import { contrast } from "./relative-luminance.js";

const { expect } = chai;

describe("isDark", () => {
    it("should treat black as dark and white as light", () => {
        expect(isDark(black)).to.be.true;
        expect(isDark(white)).to.be.false;
    });

    it("should treat #757575 (the darkest grey with 4.5:1 against white) as dark", () => {
        expect(isDark(parseColor("#757575")!)).to.be.true;
    });

    it("should treat #777777 (just lighter than the threshold) as light", () => {
        expect(isDark(parseColor("#777777")!)).to.be.false;
    });

    it("should be the point of equal contrast against black and white", () => {
        const dark = parseColor("#757575")!;
        const light = parseColor("#777777")!;

        expect(contrast(dark, white)).to.be.gte(contrast(dark, black));
        expect(contrast(light, white)).to.be.lessThan(contrast(light, black));
    });
});

describe("directionByIsDark", () => {
    it("should move lighter from a dark color", () => {
        expect(directionByIsDark(black)).to.equal(PaletteDirection.lighter);
    });

    it("should move darker from a light color", () => {
        expect(directionByIsDark(white)).to.equal(PaletteDirection.darker);
    });
});
