import chai from "chai";
import { colorLuminance, rgbColor } from "./color.js";
import {
    conicGradient,
    DtcgGradient,
    formatGradient,
    fromDtcgGradient,
    GradientStop,
    isDtcgGradient,
    linearGradient,
    radialGradient,
    toGradient,
} from "./gradient.js";
import { relativeLuminance } from "./utilities/relative-luminance.js";

const { expect } = chai;

const colorRed = rgbColor(1, 0, 0);
const colorGreen = rgbColor(0, 1, 0);
const colorBlue = rgbColor(0, 0, 1);

describe("Gradient", () => {
    it("should create a conic gradient", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 360, unit: "deg" } },
        ];
        const gradient = conicGradient(stops, 44);

        expect(gradient.type).to.equal("conic");
        expect(formatGradient(gradient)).to.equal("conic-gradient(from 44deg, #ff0000 0deg, #0000ff 360deg)");
    });

    it("should create a linear gradient", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ];
        const gradient = linearGradient(stops, 44);

        expect(gradient.type).to.equal("linear");
        expect(formatGradient(gradient)).to.equal("linear-gradient(44deg, #ff0000 0%, #0000ff 100%)");
    });

    it("should create a radial gradient", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ];
        const gradient = radialGradient(stops);

        expect(gradient.type).to.equal("radial");
        expect(formatGradient(gradient)).to.equal("radial-gradient(#ff0000 0%, #0000ff 100%)");
    });

    it("should throw an error for a gradient with one stop", () => {
        const stops: GradientStop[] = [{ color: colorGreen, position: { value: 0, unit: "%" } }];

        expect(() => linearGradient(stops, 44)).to.throw(Error, "A Gradient must have at least two stops");
    });

    it("should throw an error for a conic gradient with invalid positions", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 360, unit: "px" } },
        ];

        expect(() => conicGradient(stops, 44)).to.throw(Error, "All stop positions must have a unit of 'deg'");
    });

    it("should throw an error for a linear gradient with invalid positions", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 360, unit: "deg" } },
        ];

        expect(() => linearGradient(stops, 44)).to.throw(Error, "All stop positions must have a unit of '%' or 'px'");
    });

    it("should throw an error for a radial gradient with invalid positions", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 360, unit: "deg" } },
        ];

        expect(() => radialGradient(stops)).to.throw(Error, "All stop positions must have a unit of '%' or 'px'");
    });

    it("should expose the type, stops, and angle", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ];

        expect(linearGradient(stops, 10).type).to.equal("linear");
        expect(linearGradient(stops, 10).angle).to.equal(10);
        expect(linearGradient(stops).angle).to.equal(0);
        expect(linearGradient(stops).stops).to.deep.equal(stops);
        expect(radialGradient(stops).type).to.equal("radial");
        expect(
            conicGradient([
                { color: colorRed, position: { value: 0, unit: "deg" } },
                { color: colorBlue, position: { value: 90, unit: "deg" } },
            ]).type
        ).to.equal("conic");
    });

    it("should be plain data that is frozen", () => {
        const gradient = linearGradient(
            [
                { color: colorRed, position: { value: 0, unit: "%" } },
                { color: colorBlue, position: { value: 1, unit: "%" } },
            ],
            90
        );

        expect(JSON.parse(JSON.stringify(gradient))).to.deep.equal({
            type: "linear",
            stops: [
                { color: { colorSpace: "srgb", components: [1, 0, 0] }, position: { value: 0, unit: "%" } },
                { color: { colorSpace: "srgb", components: [0, 0, 1] }, position: { value: 1, unit: "%" } },
            ],
            angle: 90,
        });
        expect(Object.isFrozen(gradient)).to.be.true;
        expect(Object.isFrozen(gradient.stops)).to.be.true;
    });

    it("should not change when the provided stops change", () => {
        const stops: GradientStop[] = [
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ];
        const gradient = linearGradient(stops);

        stops.pop();

        expect(gradient.stops.length).to.equal(2);
    });

    it("should default the angle of a conic gradient to 0", () => {
        const gradient = conicGradient([
            { color: colorRed, position: { value: 0, unit: "deg" } },
            { color: colorBlue, position: { value: 90, unit: "deg" } },
        ]);

        expect(gradient.angle).to.equal(0);
        expect(formatGradient(gradient)).to.equal("conic-gradient(from 0deg, #ff0000 0deg, #0000ff 90deg)");
    });

    it("should use the relative luminance of the first stop", () => {
        const gradient = radialGradient([
            { color: colorGreen, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ]);

        expect(relativeLuminance(gradient)).to.equal(colorLuminance(colorGreen));
    });

    it("should write percentage positions as a fraction of 100 and other units as-is", () => {
        const gradient = linearGradient([
            { color: colorRed, position: { value: 0.25, unit: "%" } },
            { color: colorGreen, position: { value: 20, unit: "px" } },
            { color: colorBlue, position: { value: 100, unit: "px" } },
        ]);

        expect(formatGradient(gradient)).to.equal("linear-gradient(0deg, #ff0000 25%, #00ff00 20px, #0000ff 100px)");
    });

    it("should write the end position of a stop", () => {
        const linear = linearGradient(
            [
                { color: colorRed, position: { value: 0, unit: "%" }, endPosition: { value: 0.5, unit: "%" } },
                { color: colorBlue, position: { value: 0.5, unit: "%" }, endPosition: { value: 1, unit: "%" } },
            ],
            90
        );
        const conic = conicGradient([
            { color: colorRed, position: { value: 0, unit: "deg" }, endPosition: { value: 180, unit: "deg" } },
            { color: colorBlue, position: { value: 180, unit: "deg" }, endPosition: { value: 360, unit: "deg" } },
        ]);

        expect(formatGradient(linear)).to.equal("linear-gradient(90deg, #ff0000 0% 50%, #0000ff 50% 100%)");
        expect(formatGradient(conic)).to.equal("conic-gradient(from 0deg, #ff0000 0deg 180deg, #0000ff 180deg 360deg)");
    });

    it("should throw an error for an end position with an invalid unit", () => {
        const badEnd = (unit: any, valid: any): GradientStop[] => [
            { color: colorRed, position: { value: 0, unit: valid }, endPosition: { value: 1, unit } },
            { color: colorBlue, position: { value: 1, unit: valid } },
        ];

        expect(() => conicGradient(badEnd("%", "deg"))).to.throw("All stop positions must have a unit of 'deg'");
        expect(() => linearGradient(badEnd("deg", "%"))).to.throw("All stop positions must have a unit of '%' or 'px'");
        expect(() => radialGradient(badEnd("deg", "%"))).to.throw("All stop positions must have a unit of '%' or 'px'");
    });

    it("should allow mixing percent and pixel positions", () => {
        expect(() =>
            linearGradient([
                { color: colorRed, position: { value: 0, unit: "%" } },
                { color: colorBlue, position: { value: 100, unit: "px" } },
            ])
        ).not.to.throw();
    });

    it("should throw an error for no stops", () => {
        expect(() => radialGradient([])).to.throw("A Gradient must have at least two stops");
    });
});

describe("DTCG gradient", () => {
    const dtcg: DtcgGradient = [
        { color: colorRed, position: 0 },
        { color: colorBlue, position: 1 },
    ];

    it("should be identified, as a list of stops", () => {
        expect(isDtcgGradient(dtcg)).to.be.true;
        expect(
            isDtcgGradient(
                linearGradient([
                    { color: colorRed, position: { value: 0, unit: "%" } },
                    { color: colorBlue, position: { value: 1, unit: "%" } },
                ])
            )
        ).to.be.false;
    });

    it("should become a linear gradient from the top to the bottom", () => {
        const gradient = fromDtcgGradient(dtcg);

        expect(gradient.type).to.equal("linear");
        expect(gradient.angle).to.equal(180);
        expect(gradient.stops).to.deep.equal([
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ]);
    });

    it("should have the angle that is asked for", () => {
        expect(fromDtcgGradient(dtcg, 90).angle).to.equal(90);
    });

    it("should be written as CSS like a gradient", () => {
        expect(formatGradient(dtcg)).to.equal("linear-gradient(180deg, #ff0000 0%, #0000ff 100%)");
        expect(formatGradient(fromDtcgGradient(dtcg, 90))).to.equal("linear-gradient(90deg, #ff0000 0%, #0000ff 100%)");
    });

    it("should leave a gradient that is not one as it is", () => {
        const gradient = radialGradient([
            { color: colorRed, position: { value: 0, unit: "%" } },
            { color: colorBlue, position: { value: 1, unit: "%" } },
        ]);

        expect(toGradient(gradient)).to.equal(gradient);
        expect(toGradient(dtcg).type).to.equal("linear");
    });

    it("should need two stops, like a gradient", () => {
        expect(() => fromDtcgGradient([{ color: colorRed, position: 0 }])).to.throw("A Gradient must have at least two stops");
    });
});
