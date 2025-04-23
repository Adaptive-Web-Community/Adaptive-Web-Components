import chai from "chai";
import { Color } from "./color.js";
import { type Rgb } from "culori/fn";
import { _white } from "./utilities/color-constants.js";

const { expect } = chai;

const greyColor: Rgb = { mode: "rgb", r: 0.5, g: 0.5, b: 0.5, alpha: undefined };
const greyObject = { r: 0.5, g: 0.5, b: 0.5, alpha: undefined };
const greyHex = "#808080";

const opacityColor: Rgb = { mode: "rgb", r: 0.2, g: 0.4, b: 0.6, alpha: 0.5019607843137255 };
const opacityHex = "#33669980";
const opacityRgba = "rgba(51, 102, 153, 0.5)";

describe("Color", () => {
    it("should create a Color from the provided object", () => {
        const color = Color.from(greyObject);

        expect(color).to.be.instanceof(Color);
        expect(color.color).to.deep.equal(greyColor);
        expect(color.toColorString()).to.equal(greyHex);
    });

    it("should create a Color from the provided RGB values", () => {
        const color = Color.fromRgb(0.5, 0.5, 0.5);

        expect(color).to.be.instanceof(Color);
        expect(color.color).to.deep.equal(greyColor);
        expect(color.toColorString()).to.equal(greyHex);
    });

    it("should create a Color from the provided hex color", () => {
        const color = Color.parse(greyHex)!;

        expect(color).to.be.instanceof(Color);
        expect(color.toColorString()).to.equal(greyHex);
    });

    it("should create a Color with opacity", () => {
        const color = Color.parse(opacityHex)!;

        expect(color).to.be.instanceof(Color);
        expect(color.color).to.deep.equal(opacityColor);
        expect(color.toColorString()).to.equal(opacityRgba);
    });

    it("should provide the correct relative luminance", () => {
        const color = Color.from(greyObject);

        expect(color.relativeLuminance).to.approximately(0.21, 0.01);
    });

    it("should provide a string representation", () => {
        const color = Color.from(greyObject);

        expect(color.toString()).to.equal(greyHex);
    });

    it("should provide a css representation", () => {
        const color = Color.from(greyObject);

        expect(color.createCSS()).to.equal(greyHex);
    });

    it("should provide its contrast with another value", () => {
        const color = Color.from(greyObject);

        expect(color.contrast(_white)).to.approximately(3.9, 0.1);
    });
});
