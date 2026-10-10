import chai from "chai";
import { Color } from "./color.js";
import { DesignTokenMultiValuePaint, Paint, PaintBase } from "./paint.js";
import { _black, _white } from "./utilities/color-constants.js";
import { LinearGradient } from "./gradient.js";

const { expect } = chai;

class TestPaint extends PaintBase {
    constructor(luminance: number) {
        super(luminance);
    }
}

describe("PaintBase", () => {
    it("should expose the relative luminance", () => {
        expect(new TestPaint(0.3).relativeLuminance).to.equal(0.3);
    });

    it("should calculate contrast with another paint", () => {
        expect(new TestPaint(1).contrast(new TestPaint(0))).to.approximately(21, 0.0001);
    });

    it("should require subclasses to implement createCSS", () => {
        expect(() => new TestPaint(0).createCSS(() => undefined)).to.throw("Method not implemented.");
    });
});

describe("DesignTokenMultiValuePaint", () => {
    it("should use the first paint for relative luminance", () => {
        const paint = new DesignTokenMultiValuePaint(_white, _black);

        expect(paint.relativeLuminance).to.equal(1);
    });

    it("should calculate contrast using the first paint", () => {
        const paint = new DesignTokenMultiValuePaint(_white, _black);

        expect(paint.contrast(_black)).to.approximately(21, 0.0001);
        expect(_black.contrast(paint)).to.approximately(21, 0.0001);
    });

    it("should create css for each value separated by commas", () => {
        const gradient = new LinearGradient([
            { color: Color.fromRgb(1, 0, 0), position: { value: 0, unit: "%" } },
            { color: Color.fromRgb(0, 0, 1), position: { value: 1, unit: "%" } },
        ], 90);
        const paint = new DesignTokenMultiValuePaint(gradient, _white);

        expect(paint.createCSS()).to.equal("linear-gradient(90deg, #ff0000 0%, #0000ff 100%), #ffffff");
    });

    it("should be usable as a Paint", () => {
        const paints: Paint[] = [_white, new DesignTokenMultiValuePaint(_black)];

        expect(paints.map(p => p.relativeLuminance)).to.deep.equal([1, 0]);
    });
});
