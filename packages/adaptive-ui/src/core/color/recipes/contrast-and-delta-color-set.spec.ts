import chai from "chai";
import { Color, colorLuminance } from "../color.js";
import { createPalette, PaletteDirection } from "../palette.js";
import { luminanceColor } from "../utilities/luminance-color.js";
import { contrast } from "../utilities/relative-luminance.js";
import { contrastAndDeltaColorBySet, contrastAndDeltaColorSet } from "./contrast-and-delta-color-set.js";

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

// The first swatch with at least this contrast against white
const accessibleFromWhite = swatches.findIndex(s => contrast(s, swatches[0]) >= 3);

describe("contrastAndDeltaColorSet", (): void => {
    it("should have a rest or hover state that is the first color to meet the contrast", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(0, 1, 2, 3, 0), { direction: darker });

        expect(set.rest).to.equal(swatches[accessibleFromWhite]);
    });

    it("should offset hover from rest by the difference of the rest and hover deltas", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(0, 2, 0, 0, 0), { direction: darker });

        expect(set.rest).to.equal(swatches[accessibleFromWhite]);
        expect(set.hover).to.equal(swatches[accessibleFromWhite + 2]);
    });

    it("should swap rest and hover when the hover delta is lower in the darker direction", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(2, 0, 0, 0, 0), { direction: darker });

        expect(set.hover).to.equal(swatches[accessibleFromWhite]);
        expect(set.rest).to.equal(swatches[accessibleFromWhite + 2]);
    });

    it("should offset hover in the lighter direction", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[10], 3, deltas(0, 1, 0, 0, 0), { direction: lighter });
        const restIndex = palette.swatches.indexOf(set.rest!);

        expect(contrast(set.rest!, swatches[10])).to.be.gte(3);
        expect(set.hover).to.equal(swatches[restIndex - 1]);
    });

    it("should calculate active and focus from rest and disabled from the reference", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(0, 1, 2, 3, 1), { direction: darker });
        const restIndex = palette.swatches.indexOf(set.rest!);

        expect(set.active).to.equal(swatches[restIndex + 2]);
        expect(set.focus).to.equal(swatches[restIndex + 3]);
        expect(set.disabled).to.equal(swatches[1]);
    });

    it("should use the disabled palette for the disabled state", (): void => {
        const other = createPalette(swatches[5], [...swatches].reverse());
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(0, 1, 2, 3, 1), {
            disabledPalette: other,
            direction: darker,
        });

        expect(set.disabled).to.equal(other.swatches[1]);
    });

    it("should default the direction based on the reference", (): void => {
        const fromLight = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(0, 1, 0, 0, 0));
        const fromDark = contrastAndDeltaColorSet(palette, swatches[10], 3, deltas(0, 1, 0, 0, 0));

        expect(colorLuminance(fromLight.hover!)).to.be.lessThan(colorLuminance(fromLight.rest!));
        expect(colorLuminance(fromDark.hover!)).to.be.greaterThan(colorLuminance(fromDark.rest!));
    });

    it("should clamp to the ends of the palette", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(0, 1, 50, -50, 50), { direction: darker });

        expect(set.active).to.equal(swatches[10]);
        expect(set.focus).to.equal(swatches[0]);
        expect(set.disabled).to.equal(swatches[10]);
    });

    describe("zeroAsTransparent", (): void => {
        it("should return an invisible overlay for the state at the reference index", (): void => {
            // A contrast of 1 means the accessible color is the reference itself.
            const set = contrastAndDeltaColorSet(palette, swatches[3], 1, deltas(0, 1, 0, 0, 0), {
                direction: darker,
                zeroAsTransparent: true,
            });

            expect(set.rest!.alpha).to.equal(0);
            expect(colorLuminance(set.rest!)).to.equal(colorLuminance(swatches[3]));
            expect(set.hover).to.equal(swatches[4]);
        });

        it("should return opaque colors when not requested", (): void => {
            const set = contrastAndDeltaColorSet(palette, swatches[3], 1, deltas(0, 1, 0, 0, 0), { direction: darker });

            expect(set.rest).to.equal(swatches[3]);
        });
    });
});

describe("contrastAndDeltaColorSet with only some of the states", (): void => {
    const options = { direction: darker };

    it("should have a color only for the states that have a delta", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, { focus: 0 }, options);

        expect(Object.keys(set)).to.deep.equal(["focus"]);
    });

    it("should place the states from the accessible color as if the rest and the hover had no delta", (): void => {
        const full = contrastAndDeltaColorSet(palette, swatches[0], 3, deltas(0, 0, 2, 3, 1), options);
        const sparse = contrastAndDeltaColorSet(palette, swatches[0], 3, { active: 2, focus: 3, disabled: 1 }, options);

        expect(sparse.active).to.equal(full.active);
        expect(sparse.focus).to.equal(full.focus);
        expect(sparse.disabled).to.equal(full.disabled);
    });

    it("should have the hover where the rest is when it has no delta", (): void => {
        const set = contrastAndDeltaColorSet(palette, swatches[0], 3, { rest: 0, hover: 0 }, options);

        expect(set.hover).to.equal(set.rest);
        expect(set.rest).to.equal(swatches[accessibleFromWhite]);
    });

    it("should clear a state that has a null delta", (): void => {
        expect(contrastAndDeltaColorSet(palette, swatches[0], 3, { rest: 0, active: null }, options).active).to.be.null;
    });
});

describe("contrastAndDeltaColorBySet", (): void => {
    const strokeDeltas = deltas(0, 2, 1, 0, 2);
    const backgrounds = { rest: swatches[0], hover: swatches[1], active: swatches[2], disabled: swatches[3] };

    it("should be the rest of the set made over the background of each state", (): void => {
        const set = contrastAndDeltaColorBySet(palette, backgrounds, 3, strokeDeltas, { direction: darker });

        expect(set.rest).to.equal(contrastAndDeltaColorSet(palette, swatches[0], 3, strokeDeltas, { direction: darker }).rest);
        expect(set.hover).to.equal(contrastAndDeltaColorSet(palette, swatches[1], 3, strokeDeltas, { direction: darker }).rest);
        expect(set.active).to.equal(contrastAndDeltaColorSet(palette, swatches[2], 3, strokeDeltas, { direction: darker }).rest);
    });

    it("should be the disabled of the set made over the disabled background", (): void => {
        const set = contrastAndDeltaColorBySet(palette, backgrounds, 3, strokeDeltas, { direction: darker });

        expect(set.disabled).to.equal(contrastAndDeltaColorSet(palette, swatches[3], 3, strokeDeltas, { direction: darker }).disabled);
    });

    it("should have only the states that have a background, and keep a state that is cleared", (): void => {
        const set = contrastAndDeltaColorBySet(palette, { rest: swatches[0], hover: null }, 3, strokeDeltas, { direction: darker });

        expect(Object.keys(set)).to.deep.equal(["rest", "hover"]);
        expect(set.hover).to.be.null;
    });

    it("should be semitransparent over the background of each state as an overlay", (): void => {
        const set = contrastAndDeltaColorBySet(palette, backgrounds, 3, strokeDeltas, { direction: darker, asOverlay: true });
        const opaque = contrastAndDeltaColorBySet(palette, backgrounds, 3, strokeDeltas, { direction: darker });

        expect(set.hover?.alpha).to.be.lessThan(1);
        expect(set.hover).to.not.deep.equal(opaque.hover);
    });
});
