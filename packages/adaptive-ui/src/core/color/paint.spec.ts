import chai from "chai";
import { rgbColor } from "./color.js";
import { DtcgGradient, linearGradient } from "./gradient.js";
import { formatPaint, isGradient, isPaint, Paint } from "./paint.js";
import { black, white } from "./utilities/color-constants.js";

const { expect } = chai;

const gradient = linearGradient(
    [
        { color: rgbColor(1, 0, 0), position: { value: 0, unit: "%" } },
        { color: rgbColor(0, 0, 1), position: { value: 1, unit: "%" } },
    ],
    90
);

describe("Paint", () => {
    it("should identify a gradient", () => {
        expect(isGradient(gradient)).to.be.true;
    });

    it("should identify a DTCG gradient", () => {
        const dtcg: DtcgGradient = [
            { color: rgbColor(1, 0, 0), position: 0 },
            { color: rgbColor(0, 0, 1), position: 1 },
        ];

        expect(isGradient(dtcg)).to.be.true;
        expect(formatPaint(dtcg)).to.equal("linear-gradient(180deg, #ff0000 0%, #0000ff 100%)");
    });

    it("should tell a paint from any other value", () => {
        const dtcg: DtcgGradient = [
            { color: rgbColor(1, 0, 0), position: 0 },
            { color: rgbColor(0, 0, 1), position: 1 },
        ];

        expect([white, gradient, dtcg].map(isPaint)).to.deep.equal([true, true, true]);
        expect([undefined, null, 4, "#fff", [], [1, 2], { value: 4, unit: "px" }, { rest: white }].map(isPaint)).to.deep.equal(
            [false, false, false, false, false, false, false, false]
        );
    });

    it("should identify a color", () => {
        expect(isGradient(white)).to.be.false;
        expect(isGradient(black)).to.be.false;
    });

    it("should format a color or a gradient for CSS", () => {
        const paints: Paint[] = [white, gradient];

        expect(paints.map(formatPaint)).to.deep.equal(["#ffffff", "linear-gradient(90deg, #ff0000 0%, #0000ff 100%)"]);
    });
});
