import chai from "chai";
import { Color } from "./color.js";
import { ConicGradient, GradientStop, LinearGradient, RadialGradient } from "./gradient.js";

const { expect } = chai;

const colorRed = Color.fromRgb(1, 0, 0);
const colorGreen = Color.fromRgb(0, 1, 0);
const colorBlue = Color.fromRgb(0, 0, 1);

describe("Gradient", () => {
    it("should create a ConicGradient", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 360, unit: "deg" } },
        ];
        const gradient = new ConicGradient(stops, 44);

        expect(gradient).to.be.instanceof(ConicGradient);
        expect(gradient.toString()).to.equal("conic-gradient(from 44deg, #ff0000 0deg, #0000ff 360deg)");
    });

    it("should create a LinearGradient", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ];
        const gradient = new LinearGradient(stops, 44);

        expect(gradient).to.be.instanceof(LinearGradient);
        expect(gradient.toString()).to.equal("linear-gradient(44deg, #ff0000 0%, #0000ff 100%)");
    });

    it("should create a RadialGradient", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ];
        const gradient = new RadialGradient(stops);

        expect(gradient).to.be.instanceof(RadialGradient);
        expect(gradient.toString()).to.equal("radial-gradient(#ff0000 0%, #0000ff 100%)");
    });

    it("should throw an error for a Gradient with one stop", () => {
        const stops: GradientStop[] = [
            { color: colorGreen, position: { value: 0, unit: "%" } },
        ];

        expect(() => new LinearGradient(stops, 44)).to.throw(Error, "A Gradient must have at least two stops");
    });

    it("should throw an error for a ConicGradient with invalid positions", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 360, unit: "px" } },
        ];

        expect(() => new ConicGradient(stops, 44)).to.throw(Error, "All stop positions must have a unit of 'deg'");
    });

    it("should throw an error for a LinearGradient with invalid positions", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 360, unit: "deg" } },
        ];

        expect(() => new LinearGradient(stops, 44)).to.throw(Error, "All stop positions must have a unit of '%' or 'px'");
    });

    it("should throw an error for a RadialGradient with invalid positions", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 360, unit: "deg" } },
        ];

        expect(() => new RadialGradient(stops)).to.throw(Error, "All stop positions must have a unit of '%' or 'px'");
    });

    it("should expose the type, stops, and angle", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ];

        expect(new LinearGradient(stops, 10).type).to.equal("linear");
        expect(new LinearGradient(stops, 10).angle).to.equal(10);
        expect(new LinearGradient(stops).angle).to.equal(0);
        expect(new LinearGradient(stops).stops).to.equal(stops);
        expect(new RadialGradient(stops).type).to.equal("radial");
        expect(
            new ConicGradient(
                [
                    { color: colorRed, position: { value: 0, unit: "deg" } },
                    { color: colorBlue, position: { value: 90, unit: "deg" } },
                ]
            ).type
        ).to.equal("conic");
    });

    it("should default the angle of a ConicGradient to 0", () => {
        const gradient = new ConicGradient([
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 90, unit: "deg" } },
        ]);

        expect(gradient.angle).to.equal(0);
        expect(gradient.toString()).to.equal("conic-gradient(from 0deg, #ff0000 0deg, #0000ff 90deg)");
    });

    it("should use the relative luminance of the first stop", () => {
        const gradient = new RadialGradient([
            { color: colorGreen, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ]);

        expect(gradient.relativeLuminance).to.equal(colorGreen.relativeLuminance);
    });

    it("should provide the same output for toString and createCSS", () => {
        const gradient = new LinearGradient([
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ], 90);

        expect(gradient.createCSS()).to.equal(gradient.toString());
    });

    it("should write percentage positions as a fraction of 100 and other units as-is", () => {
        const gradient = new LinearGradient([
            { color: colorRed, position: { value: 0.25, unit: "%" } },
            { color: colorGreen, position: { value: 20, unit: "px" } },
            { color: colorBlue, position: { value: 100, unit: "px" } },
        ]);

        expect(gradient.toString()).to.equal("linear-gradient(0deg, #ff0000 25%, #00ff00 20px, #0000ff 100px)");
    });

    it("should write the end position of a stop", () => {
        const linear = new LinearGradient([
            { color: colorRed, position: { value: 0, unit: "%" }, endPosition: { value: 0.5, unit: "%" } },
            { color: colorBlue, position: { value: 0.5, unit: "%" }, endPosition: { value: 1, unit: "%" } },
        ], 90);
        const conic = new ConicGradient([
            { color: colorRed, position: { value: 0, unit: "deg" }, endPosition: { value: 180, unit: "deg" } },
            { color: colorBlue, position: { value: 180, unit: "deg" }, endPosition: { value: 360, unit: "deg" } },
        ]);

        expect(linear.toString()).to.equal("linear-gradient(90deg, #ff0000 0% 50%, #0000ff 50% 100%)");
        expect(conic.toString()).to.equal("conic-gradient(from 0deg, #ff0000 0deg 180deg, #0000ff 180deg 360deg)");
    });

    it("should throw an error for an end position with an invalid unit", () => {
        const badEnd = (unit: any, valid: any): GradientStop[] => [
            { color: colorRed, position: { value: 0, unit: valid }, endPosition: { value: 1, unit } },
            { color: colorBlue, position: { value: 1, unit: valid } },
        ];

        expect(() => new ConicGradient(badEnd("%", "deg"))).to.throw("All stop positions must have a unit of 'deg'");
        expect(() => new LinearGradient(badEnd("deg", "%"))).to.throw("All stop positions must have a unit of '%' or 'px'");
        expect(() => new RadialGradient(badEnd("deg", "%"))).to.throw("All stop positions must have a unit of '%' or 'px'");
    });

    it("should allow mixing percent and pixel positions", () => {
        expect(() => new LinearGradient([
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 100, unit: "px" } },
        ])).not.to.throw();
    });

    it("should throw an error for no stops", () => {
        expect(() => new RadialGradient([])).to.throw("A Gradient must have at least two stops");
    });
});
