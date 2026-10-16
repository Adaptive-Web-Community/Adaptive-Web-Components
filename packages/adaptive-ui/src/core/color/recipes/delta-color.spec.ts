import chai from "chai";
import { Color } from "../color.js";
import { createPalette, PaletteDirection } from "../palette.js";
import { luminanceColor } from "../utilities/luminance-color.js";
import { deltaColor } from "./delta-color.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceColor(1 - i / 10));
const palette = createPalette(swatches[5], swatches);

describe("deltaColor", (): void => {
    it("should move darker from a light reference by default", (): void => {
        expect(deltaColor(palette, swatches[2], 3)).to.equal(swatches[5]);
    });

    it("should move lighter from a dark reference by default", (): void => {
        expect(deltaColor(palette, swatches[9], 3)).to.equal(swatches[6]);
    });

    it("should honor an explicit direction", (): void => {
        expect(deltaColor(palette, swatches[9], 3, PaletteDirection.darker)).to.equal(swatches[10]);
        expect(deltaColor(palette, swatches[2], 3, PaletteDirection.lighter)).to.equal(swatches[0]);
        expect(deltaColor(palette, swatches[5], 2, PaletteDirection.lighter)).to.equal(swatches[3]);
    });

    it("should return the reference color for a delta of zero", (): void => {
        expect(deltaColor(palette, swatches[4], 0)).to.equal(swatches[4]);
    });

    it("should invert when the delta is negative", (): void => {
        expect(deltaColor(palette, swatches[3], -2, PaletteDirection.darker)).to.equal(swatches[1]);
    });

    it("should round a fractional delta to a swatch", (): void => {
        expect(deltaColor(palette, swatches[3], 1.5, PaletteDirection.darker)).to.equal(swatches[5]);
        expect(deltaColor(palette, swatches[3], 1.4, PaletteDirection.darker)).to.equal(swatches[4]);
    });

    it("should clamp to the ends of the palette", (): void => {
        expect(deltaColor(palette, swatches[2], 100)).to.equal(swatches[10]);
        expect(deltaColor(palette, swatches[9], 100)).to.equal(swatches[0]);
    });
});
