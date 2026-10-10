import chai from "chai";
import { Color } from "../color.js";
import { InteractiveColorSet } from "../recipe.js";
import { conditionalSwatchSet } from "./conditional.js";

const { expect } = chai;

describe("conditionalSwatchSet", () => {
    const red = Color.fromRgb(1, 0, 0);
    const set: InteractiveColorSet = { rest: red, hover: red, active: red, focus: red, disabled: red };

    it("should return the provided set when the condition is true", () => {
        expect(conditionalSwatchSet(set, true)).to.equal(set);
    });

    it("should return a transparent set when the condition is false", () => {
        const result = conditionalSwatchSet(set, false);

        expect(result).not.to.equal(set);
        expect(result.rest).to.equal(Color.transparent);
        expect(result.hover).to.equal(Color.transparent);
        expect(result.active).to.equal(Color.transparent);
        expect(result.focus).to.equal(Color.transparent);
        expect(result.disabled).to.equal(Color.transparent);
    });
});
