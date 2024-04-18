import chai from "chai";
import { Swatch } from "./swatch.js";
import { type Rgb } from "culori/fn";

const { expect } = chai;

const greyColor: Rgb = { mode: "rgb", r: 0.5, g: 0.5, b: 0.5, alpha: undefined };
const greyObject = { r: 0.5, g: 0.5, b: 0.5, alpha: undefined };
const greyHex = "#808080";

const opacityColor: Rgb = { mode: "rgb", r: 0.2, g: 0.4, b: 0.6, alpha: 0.5019607843137255 };
const opacityHex = "#33669980";
const opacityRgba = "rgba(51, 102, 153, 0.5)";

describe("Swatch", () => {
    it("should create a Swatch from the provided object", () => {
        const swatch = Swatch.from(greyObject);

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal(greyColor);
        expect(swatch.toColorString()).to.equal(greyHex);
    });

    it("should create a Swatch from the provided RGB values", () => {
        const swatch = Swatch.fromRgb(0.5, 0.5, 0.5);

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal(greyColor);
        expect(swatch.toColorString()).to.equal(greyHex);
    });

    it("should create a Swatch from the provided hex swatch", () => {
        const swatch = Swatch.parse(greyHex)!;

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.toColorString()).to.equal(greyHex);
    });

    it("should create a Swatch with opacity", () => {
        const swatch = Swatch.parse(opacityHex)!;

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal(opacityColor);
        expect(swatch.toColorString()).to.equal(opacityRgba);
    });
});
