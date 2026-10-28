import chai from "chai";
import { rgbColor } from "../color/color.js";
import { isShadow, shadow } from "./shadow.js";

const { expect } = chai;

const black = rgbColor(0, 0, 0);

describe("shadow", () => {
    it("should be a DTCG shadow layer, in px", () => {
        expect(shadow(black, 1, 2, 3, 4)).to.deep.equal({
            color: black,
            offsetX: { value: 1, unit: "px" },
            offsetY: { value: 2, unit: "px" },
            blur: { value: 3, unit: "px" },
            spread: { value: 4, unit: "px" },
        });
    });

    it("should have no blur or spread unless it is given one", () => {
        const layer = shadow(black, 1, 2);

        expect(layer.blur).to.deep.equal({ value: 0, unit: "px" });
        expect(layer.spread).to.deep.equal({ value: 0, unit: "px" });
    });

    it("should be frozen", () => {
        expect(Object.isFrozen(shadow(black, 1, 2))).to.be.true;
    });
});

describe("isShadow", () => {
    it("should be true for a layer and for layers", () => {
        expect(isShadow(shadow(black, 1, 2))).to.be.true;
        expect(isShadow([shadow(black, 1, 2), shadow(black, 3, 4)])).to.be.true;
    });

    it("should be false for other values", () => {
        expect(isShadow(black)).to.be.false;
        expect(isShadow({ value: 1, unit: "px" })).to.be.false;
        expect(isShadow([])).to.be.false;
        expect(isShadow(null)).to.be.false;
        expect(isShadow("0px 1px #000000")).to.be.false;
    });
});
