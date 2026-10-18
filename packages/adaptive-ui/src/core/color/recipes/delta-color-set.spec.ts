import chai from "chai";
import { Color, colorLuminance } from "../color.js";
import { closestSwatchIndex, createPalette, PaletteDirection, swatchAt } from "../palette.js";
import { luminanceColor } from "../utilities/luminance-color.js";
import { deltaColorSet } from "./delta-color-set.js";

const { expect } = chai;

// Eleven greys from white (index 0) to black (index 10).
const swatches: Color[] = Array.from({ length: 11 }, (_, i) => luminanceColor(1 - i / 10));
const palette = createPalette(swatches[5], swatches);
const { darker, lighter } = PaletteDirection;

const deltas = (rest: number, hover: number, active: number, focus: number, disabled: number) => ({
    rest,
    hover,
    active,
    focus,
    disabled,
});

describe("deltaColorSet", (): void => {
    it("should apply each delta from the reference in the direction", (): void => {
        const set = deltaColorSet(palette, swatches[2], deltas(0, 1, 2, 3, 4), { direction: darker });

        expect(set.rest).to.equal(swatches[2]);
        expect(set.hover).to.equal(swatches[3]);
        expect(set.active).to.equal(swatches[4]);
        expect(set.focus).to.equal(swatches[5]);
        expect(set.disabled).to.equal(swatches[6]);
    });

    it("should apply the deltas in the opposite direction", (): void => {
        const set = deltaColorSet(palette, swatches[8], deltas(0, 1, 2, 3, 4), { direction: lighter });

        expect(set.rest).to.equal(swatches[8]);
        expect(set.hover).to.equal(swatches[7]);
        expect(set.active).to.equal(swatches[6]);
        expect(set.focus).to.equal(swatches[5]);
        expect(set.disabled).to.equal(swatches[4]);
    });

    it("should default the direction based on the reference", (): void => {
        const fromLight = deltaColorSet(palette, swatches[1], deltas(1, 2, 3, 4, 4));
        const fromDark = deltaColorSet(palette, swatches[9], deltas(1, 2, 3, 4, 4));

        expect(fromLight.rest).to.equal(swatches[2]);
        expect(fromLight.focus).to.equal(swatches[5]);
        expect(fromDark.rest).to.equal(swatches[8]);
        expect(fromDark.focus).to.equal(swatches[5]);
    });

    it("should use the disabled palette for the disabled state only", (): void => {
        const other = createPalette(swatches[5], [...swatches].reverse());
        const set = deltaColorSet(palette, swatches[2], deltas(1, 1, 1, 1, 1), {
            disabledPalette: other,
            direction: darker,
        });

        expect(set.rest).to.equal(swatches[3]);
        expect(set.disabled).to.equal(swatchAt(other, closestSwatchIndex(palette, swatches[2]) + 1));
        expect(set.disabled).not.to.equal(set.rest);
    });

    it("should use the palette for the disabled state by default", (): void => {
        const set = deltaColorSet(palette, swatches[2], deltas(1, 1, 1, 1, 3), { direction: darker });

        expect(set.disabled).to.equal(swatches[5]);
    });

    it("should clamp to the ends of the palette", (): void => {
        const set = deltaColorSet(palette, swatches[8], deltas(1, 5, 10, 20, 30), { direction: darker });

        expect(set.rest).to.equal(swatches[9]);
        expect(set.hover).to.equal(swatches[10]);
        expect(set.active).to.equal(swatches[10]);
        expect(set.focus).to.equal(swatches[10]);
        expect(set.disabled).to.equal(swatches[10]);
    });

    describe("zeroAsTransparent", (): void => {
        it("should return opaque colors by default for a delta of zero", (): void => {
            const set = deltaColorSet(palette, swatches[2], deltas(0, 1, 0, 1, 0), { direction: darker });

            expect(set.rest).to.equal(swatches[2]);
            expect(set.active).to.equal(swatches[2]);
            expect(set.disabled).to.equal(swatches[2]);
        });

        it("should return an overlay for states with a delta of zero", (): void => {
            const set = deltaColorSet(palette, swatches[2], deltas(0, 1, 0, 1, 0), {
                direction: darker,
                zeroAsTransparent: true,
            });

            [set.rest, set.active, set.disabled].forEach(color => {
                // The color is the reference over itself, so it's invisible (alpha 0)
                expect(color).not.to.equal(swatches[2]);
                expect(color!.alpha).to.equal(0);
                expect(colorLuminance(color!)).to.equal(colorLuminance(swatches[2]));
            });
        });

        it("should not change states with a non-zero delta", (): void => {
            const set = deltaColorSet(palette, swatches[2], deltas(0, 1, 0, 2, 0), {
                direction: darker,
                zeroAsTransparent: true,
            });

            expect(set.hover).to.equal(swatches[3]);
            expect(set.focus).to.equal(swatches[4]);
        });
    });
});

describe("deltaColorSet with only some of the states", (): void => {
    it("should have a color only for the states that have a delta", (): void => {
        const set = deltaColorSet(palette, swatches[2], { focus: 2 }, { direction: darker });

        expect(set).to.deep.equal({ focus: swatches[4] });
        expect(Object.keys(set)).to.deep.equal(["focus"]);
    });

    it("should clear a state that has a null delta", (): void => {
        expect(deltaColorSet(palette, swatches[2], { rest: 0, hover: null }, { direction: darker })).to.deep.equal({ rest: swatches[2], hover: null });
    });

    it("should use the disabled palette for the disabled state alone", (): void => {
        const other = createPalette(swatches[5], [...swatches].reverse());
        const set = deltaColorSet(palette, swatches[2], { disabled: 1 }, { direction: darker, disabledPalette: other });

        expect(set.disabled).to.equal(other.swatches[3]);
    });
});
