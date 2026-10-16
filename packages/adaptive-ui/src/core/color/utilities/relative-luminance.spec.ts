import chai from "chai";
import { formatColor, parseColor } from "../color.js";
import { linearGradient } from "../gradient.js";
import { black, white } from "./color-constants.js";
import { luminanceColor } from "./luminance-color.js";
import { contrast, relativeLuminance } from "./relative-luminance.js";

const { expect } = chai;

describe("relativeLuminance", () => {
    it("should be 0 for black and 1 for white", () => {
        expect(relativeLuminance(black)).to.equal(0);
        expect(relativeLuminance(white)).to.equal(1);
    });

    it("should use the first stop for a gradient", () => {
        const gradient = linearGradient([
            { color: parseColor("#767676")!, position: { value: 0, unit: "%" } },
            { color: white, position: { value: 1, unit: "%" } },
        ]);

        expect(relativeLuminance(gradient)).to.equal(relativeLuminance(parseColor("#767676")!));
    });
});

describe("relativeLuminance of a DTCG gradient", () => {
    it("should use the first stop", () => {
        const dtcg = [
            { color: parseColor("#767676")!, position: 0 },
            { color: white, position: 1 },
        ];

        expect(relativeLuminance(dtcg)).to.equal(relativeLuminance(parseColor("#767676")!));
        expect(contrast(dtcg, white)).to.approximately(4.54, 0.01);
    });
});

describe("contrast", () => {
    it("should be 21 between black and white", () => {
        expect(contrast(black, white)).to.approximately(21, 0.0001);
    });

    it("should be 1 between identical colors", () => {
        expect(contrast(white, white)).to.equal(1);
        expect(contrast(black, black)).to.equal(1);
    });

    it("should be symmetric", () => {
        const grey = parseColor("#767676")!;

        expect(contrast(grey, white)).to.equal(contrast(white, grey));
    });

    it("should be 4.54 between #767676 and white", () => {
        expect(contrast(parseColor("#767676")!, white)).to.approximately(4.54, 0.01);
    });

    it("should work with gradients", () => {
        const gradient = linearGradient([
            { color: black, position: { value: 0, unit: "%" } },
            { color: white, position: { value: 1, unit: "%" } },
        ]);

        expect(contrast(gradient, white)).to.approximately(21, 0.0001);
    });
});

describe("luminanceColor", () => {
    it("should create black and white for 0 and 1", () => {
        expect(formatColor(luminanceColor(0))).to.equal("#000000");
        expect(formatColor(luminanceColor(1))).to.equal("#ffffff");
    });

    it("should create a grey for the luminance", () => {
        expect(formatColor(luminanceColor(0.5))).to.equal("#808080");
    });
});
