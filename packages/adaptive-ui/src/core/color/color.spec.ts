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

    it("should return undefined when parsing an invalid string", () => {
        expect(Color.parse("not a color")).to.be.undefined;
    });

    it("should have an unknown relative luminance when semitransparent", () => {
        const color = Color.parse(opacityHex)!;

        expect(color.relativeLuminance).to.be.NaN;
    });

    it("should have a known relative luminance when fully opaque", () => {
        expect(Color.fromRgb(1, 1, 1, 1).relativeLuminance).to.equal(1);
        expect(Color.fromRgb(0, 0, 0).relativeLuminance).to.equal(0);
    });

    it("should freeze the underlying color", () => {
        const color = Color.from(greyObject);

        expect(Object.isFrozen(color.color)).to.be.true;
    });

    it("should provide the same output from all string methods", () => {
        const color = Color.parse(opacityHex)!;

        expect(color.toString()).to.equal(opacityRgba);
        expect(color.toColorString()).to.equal(opacityRgba);
        expect(color.createCSS()).to.equal(opacityRgba);
    });

    describe("transparent", () => {
        it("should be fully transparent", () => {
            expect(Color.transparent.color.alpha).to.equal(0);
            expect(Color.transparent.toString()).to.equal("transparent");
            expect(Color.transparent.createCSS()).to.equal("transparent");
        });

        it("should be identified as transparent", () => {
            expect(Color.isTransparent(Color.transparent.color)).to.be.true;
            expect(Color.isTransparent(Color.from(greyObject).color)).to.be.false;
            expect(Color.isTransparent(Color.fromRgb(0, 0, 0, 0.1).color)).to.be.false;
            expect(Color.isTransparent(Color.fromRgb(0, 0, 0, 1).color)).to.be.false;
        });
    });

    describe("unsafeOpacity", () => {
        it("should create a new color with the provided alpha", () => {
            const color = Color.from(greyObject);
            const result = Color.unsafeOpacity(color, 0.25);

            expect(result).to.be.instanceof(Color);
            expect(result.color).to.deep.equal({ ...greyColor, alpha: 0.25 });
            expect(result.toString()).to.equal("rgba(128, 128, 128, 0.25)");
        });

        it("should not modify the original color", () => {
            const color = Color.from(greyObject);

            Color.unsafeOpacity(color, 0.25);

            expect(color.color).to.deep.equal(greyColor);
        });

        it("should not be usable for contrast calculations", () => {
            const result = Color.unsafeOpacity(Color.from(greyObject), 0.25);

            expect(result.relativeLuminance).to.be.NaN;
        });
    });

    describe("asOverlay", () => {
        const lightGrey = Color.fromRgb(0.75, 0.75, 0.75);
        const grey = Color.from(greyObject);
        const darkGrey = Color.fromRgb(0.25, 0.25, 0.25);

        it("should create a white overlay for a lighter color", () => {
            const result = Color.asOverlay(lightGrey, grey);

            expect(result.color).to.deep.equal({ mode: "rgb", r: 1, g: 1, b: 1, alpha: 0.5 });
        });

        it("should create a black overlay for a darker color", () => {
            const result = Color.asOverlay(darkGrey, grey);

            expect(result.color).to.deep.equal({ mode: "rgb", r: 0, g: 0, b: 0, alpha: 0.5 });
        });

        it("should retain the relative luminance of the intended color", () => {
            const result = Color.asOverlay(lightGrey, grey);

            expect(result.relativeLuminance).to.equal(lightGrey.relativeLuminance);
            expect(result.contrast(_white)).to.equal(lightGrey.contrast(_white));
        });

        it("should calculate against the intended color of an overlay reference", () => {
            const overlay = Color.asOverlay(lightGrey, grey);
            // Using the intended opaque color (lightGrey), black at 1/3 gets to 0.5 grey.
            const result = Color.asOverlay(darkGrey, overlay);
            const expected = Color.asOverlay(darkGrey, lightGrey);

            expect(result.color).to.deep.equal(expected.color);
        });

        it("should return the intended color when over a transparent reference", () => {
            const result = Color.asOverlay(grey, Color.transparent);

            expect(result.color.alpha).to.equal(greyColor.alpha);
        });
    });
});
