import chai from "chai";
import { rgbColor } from "../color.js";
import { transparent } from "./color-constants.js";
import { InteractiveColorSet } from "../interactive-set.js";
import { conditionalColorSet } from "./conditional.js";

const { expect } = chai;

describe("conditionalColorSet", () => {
    const red = rgbColor(1, 0, 0);
    const set: InteractiveColorSet = { rest: red, hover: red, active: red, focus: red, disabled: red };

    it("should return the provided set when the condition is true", () => {
        expect(conditionalColorSet(set, true)).to.equal(set);
    });

    it("should return a transparent set when the condition is false", () => {
        const result = conditionalColorSet(set, false);

        expect(result).not.to.equal(set);
        expect(result.rest).to.equal(transparent);
        expect(result.hover).to.equal(transparent);
        expect(result.active).to.equal(transparent);
        expect(result.focus).to.equal(transparent);
        expect(result.disabled).to.equal(transparent);
    });
});
