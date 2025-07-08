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
});
