import chai from "chai";
import { Color } from "../color.js";
import { BasePalette } from "../palette-base.js";
import { PaletteDirectionValue } from "../palette.js";
import { luminanceSwatch } from "../utilities/luminance-swatch.js";
import { deltaSwatch } from "./delta-swatch.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceSwatch(1 - i / 10));
const palette = new BasePalette(swatches[5], swatches);

describe("deltaSwatch", (): void => {
    it("should move darker from a light reference by default", (): void => {
        expect(deltaSwatch(palette, swatches[2], 3)).to.equal(swatches[5]);
    });

    it("should move lighter from a dark reference by default", (): void => {
        expect(deltaSwatch(palette, swatches[9], 3)).to.equal(swatches[6]);
    });

    it("should honor an explicit direction", (): void => {
        expect(deltaSwatch(palette, swatches[9], 3, PaletteDirectionValue.darker)).to.equal(swatches[10]);
        expect(deltaSwatch(palette, swatches[2], 3, PaletteDirectionValue.lighter)).to.equal(swatches[0]);
        expect(deltaSwatch(palette, swatches[5], 2, () => PaletteDirectionValue.lighter)).to.equal(swatches[3]);
    });

    it("should return the reference swatch for a delta of zero", (): void => {
        expect(deltaSwatch(palette, swatches[4], 0)).to.equal(swatches[4]);
    });

    it("should clamp to the ends of the palette", (): void => {
        expect(deltaSwatch(palette, swatches[2], 100)).to.equal(swatches[10]);
        expect(deltaSwatch(palette, swatches[9], 100)).to.equal(swatches[0]);
    });
});
