import chai from "chai";
import { type Rgb } from "culori/fn";
import { Color } from "./color.js";
import { Swatch } from "./swatch.js";
import { _white } from "./utilities/color-constants.js";

const { expect } = chai;

const greyColor: Rgb = { mode: "rgb", r: 0.5, g: 0.5, b: 0.5, alpha: undefined };
const greyObject = { r: 0.5, g: 0.5, b: 0.5, alpha: undefined };
const greyHex = "#808080";

const opacityColor: Rgb = { mode: "rgb", r: 0.2, g: 0.4, b: 0.6, alpha: 0.5019607843137255 };
const opacityHex = "#33669980";
const opacityRgba = "rgba(51, 102, 153, 0.5)";

const lightGreyObject = { r: 0.75, g: 0.75, b: 0.75, alpha: undefined };
const darkGreyObject = { r: 0.25, g: 0.25, b: 0.25, alpha: undefined };

describe("Swatch", () => {
    it("should create a Swatch from the provided object", () => {
        const swatch = Swatch.from(greyObject);

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal(greyColor);
        expect(swatch.toColorString()).to.equal(greyHex);
        expect(swatch.toString()).to.equal(greyHex);
    });

    it("should create a Swatch from the provided RGB values", () => {
        const swatch = Swatch.fromRgb(0.5, 0.5, 0.5);

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal(greyColor);
        expect(swatch.toColorString()).to.equal(greyHex);
    });

    it("should create a Swatch from a Color", () => {
        const color = Color.from(greyObject);
        const swatch = Swatch.fromColor(color);

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal(greyColor);
        expect(swatch.toColorString()).to.equal(greyHex);
    });

    it("should create a Swatch from the provided hex color", () => {
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

    it("should create a light Swatch as an overlay", () => {
        const lightGrey = Swatch.from(lightGreyObject);
        const grey = Swatch.from(greyObject);
        const swatch = Swatch.asOverlay(lightGrey, grey)!;

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal({ mode: "rgb", r: 1, g: 1, b: 1, alpha: 0.5 });
    });

    it("should create a dark Swatch as an overlay", () => {
        const darkGrey = Swatch.from(darkGreyObject);
        const grey = Swatch.from(greyObject);
        const swatch = Swatch.asOverlay(darkGrey, grey)!;

        expect(swatch).to.be.instanceof(Swatch);
        expect(swatch.color).to.deep.equal({ mode: "rgb", r: 0, g: 0, b: 0, alpha: 0.5 });
    });

    it("should provide the correct relative luminance", () => {
        const swatch = Swatch.from(greyObject);

        expect(swatch.relativeLuminance).to.approximately(0.21, 0.01);
    });

    it("should provide a string representation", () => {
        const swatch = Swatch.from(greyObject);

        expect(swatch.toString()).to.equal(greyHex);
    });

    it("should provide a css representation", () => {
        const swatch = Swatch.from(greyObject);

        expect(swatch.createCSS()).to.equal(greyHex);
    });

    it("should provide its contrast with another value", () => {
        const swatch = Swatch.from(greyObject);

        expect(swatch.contrast(_white)).to.approximately(3.9, 0.1);
    });

    it("should provide a transparent equivalent", () => {
        const swatch = Swatch.from(greyObject);

        const halfTransparent = swatch.toTransparent(0.5);
        expect(halfTransparent).to.be.instanceof(Swatch);
        expect(halfTransparent.color).to.deep.equal(Object.assign(greyColor, { alpha: 0.5 }));
        expect(halfTransparent.toColorString()).to.equal("rgba(128, 128, 128, 0.5)");
        expect(halfTransparent.toString()).to.equal("rgba(128, 128, 128, 0.5)");
        expect(halfTransparent.createCSS()).to.equal("rgba(128, 128, 128, 0.5)");
        expect(halfTransparent.relativeLuminance).to.approximately(0.21, 0.01);
        expect(halfTransparent.contrast(_white)).to.approximately(3.9, 0.1);
    });
});
