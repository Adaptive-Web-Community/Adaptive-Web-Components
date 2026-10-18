import chai from "chai";
import { Color, rgbColor } from "../color.js";
import { closestSwatchIndex, createPalette } from "../palette.js";
import { luminanceColor } from "../utilities/luminance-color.js";
import { invertingPaletteDeltasForSet } from "./inverting-palette-deltas-for-set.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceColor(1 - i / 10));
const palette = createPalette(swatches[5], swatches);

const deltas = (rest: number, hover: number, active: number, focus: number, disabled: number) => ({
    rest,
    hover,
    active,
    focus,
    disabled,
});

describe("invertingPaletteDeltasForSet", (): void => {
    it("should return the deltas unchanged when all are within the palette", (): void => {
        const result = invertingPaletteDeltasForSet(palette, swatches[5], deltas(1, 2, 3, 4, 5));

        expect(result).to.deep.equal({ rest: 1, hover: 2, active: 3, focus: 4, disabled: 5 });
    });

    it("should allow negative deltas within the palette", (): void => {
        const result = invertingPaletteDeltasForSet(palette, swatches[5], deltas(-1, -2, -3, -4, -5));

        expect(result).to.deep.equal({ rest: -1, hover: -2, active: -3, focus: -4, disabled: -5 });
    });

    it("should allow a delta to land on either end of the palette", (): void => {
        expect(invertingPaletteDeltasForSet(palette, swatches[5], deltas(0, 1, 2, 3, 5)).hover).to.equal(1);
        expect(invertingPaletteDeltasForSet(palette, swatches[5], deltas(0, 5, 0, 0, 0)).hover).to.equal(5);
        expect(invertingPaletteDeltasForSet(palette, swatches[5], deltas(0, -5, 0, 0, 0)).hover).to.equal(-5);
    });

    it("should invert the rest delta and keep the offsets when a delta is past the end", (): void => {
        // Reference index 8 + 3 = 11 is out of bounds.
        const result = invertingPaletteDeltasForSet(palette, swatches[8], deltas(1, 2, 3, 0, 4));

        expect(result).to.deep.equal({
            rest: -1,
            hover: -1 + 1,
            active: -1 + 2,
            focus: -1 + -1,
            disabled: -1 + 3,
        });
    });

    it("should invert when a delta is before the start of the palette", (): void => {
        // Reference index 1 + -3 = -2 is out of bounds.
        const result = invertingPaletteDeltasForSet(palette, swatches[1], deltas(-1, -2, -3, 0, -4));

        expect(result).to.deep.equal({
            rest: 1,
            hover: 1 + -1,
            active: 1 + -2,
            focus: 1 + 1,
            disabled: 1 + -3,
        });
    });

    it("should not consider the disabled delta when checking the bounds", (): void => {
        const result = invertingPaletteDeltasForSet(palette, swatches[5], deltas(1, 2, 3, 4, 100));

        expect(result.disabled).to.equal(100);
        expect(result.rest).to.equal(1);
    });

    it("should use the closest index of a reference that is not in the palette", (): void => {
        const reference = rgbColor(0.5, 0.5, 0.5);
        const index = closestSwatchIndex(palette, reference);
        const result = invertingPaletteDeltasForSet(palette, reference, deltas(10 - index + 1, 0, 0, 0, 0));

        // Index + delta is one past the end.
        expect(result.rest).to.equal(-(10 - index + 1));
    });
});

describe("invertingPaletteDeltasForSet with only some of the states", (): void => {
    it("should return the deltas unchanged when the ones that it has are within the palette", (): void => {
        expect(invertingPaletteDeltasForSet(palette, swatches[5], { hover: 2, focus: 4 })).to.deep.equal({ hover: 2, focus: 4 });
    });

    it("should invert the rest delta and keep the offsets, for the states that it has", (): void => {
        // Reference index 8 + 3 = 11 is out of bounds.
        expect(invertingPaletteDeltasForSet(palette, swatches[8], { rest: 1, hover: 3, disabled: 2 })).to.deep.equal({
            rest: -1,
            hover: -1 + 2,
            disabled: -1 + 1,
        });
    });

    it("should have the rest where it is when it has no delta, so inverting it changes nothing", (): void => {
        expect(invertingPaletteDeltasForSet(palette, swatches[8], { hover: 3, disabled: 1 })).to.deep.equal({ hover: 3, disabled: 1 });
    });
});
