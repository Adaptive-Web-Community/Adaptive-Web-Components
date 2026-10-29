import chai from "chai";
import { colorLuminance, OverlayColor, rgbColor } from "../color.js";
import { InteractiveColorSet } from "../interactive-set.js";
import { black, transparent, white } from "./color-constants.js";
import { asOverlay, calculateOverlayColor, colorAsOverlay, colorSetAsOverlay } from "./opacity.js";

const { expect } = chai;

const lightGrey = rgbColor(0.75, 0.75, 0.75);
const grey = rgbColor(0.5, 0.5, 0.5);
const darkGrey = rgbColor(0.25, 0.25, 0.25);

describe("calculateOverlayColor", () => {
    it("should use a black overlay to darken the background", () => {
        const result = calculateOverlayColor(darkGrey, grey);

        expect(result).to.deep.equal(rgbColor(0, 0, 0, 0.5));
    });

    it("should use a white overlay to lighten the background", () => {
        const result = calculateOverlayColor(lightGrey, grey);

        expect(result).to.deep.equal(rgbColor(1, 1, 1, 0.5));
    });

    it("should round the alpha to three decimal places", () => {
        // (0.5 - 0.6) / (0 - 0.6) = 0.16666...
        const result = calculateOverlayColor(rgbColor(0.5, 0.5, 0.5), rgbColor(0.6, 0.6, 0.6));

        expect(result.alpha).to.equal(0.167);
    });

    it("should produce an overlay that composites back to the match color", () => {
        const background = rgbColor(0.4, 0.4, 0.4);

        [rgbColor(0.2, 0.2, 0.2), rgbColor(0.7, 0.7, 0.7)].forEach(match => {
            const overlay = calculateOverlayColor(match, background);
            const composite = (overlay.components[0] as number) * overlay.alpha! + 0.4 * (1 - overlay.alpha!);

            expect(composite).to.approximately(match.components[0] as number, 0.001);
        });
    });

    it("should return the match color when it is transparent", () => {
        const result = calculateOverlayColor(transparent, grey);

        expect(result.alpha).to.equal(0);
    });

    it("should return the match color when the background is transparent", () => {
        const result = calculateOverlayColor(grey, transparent);

        expect(result).to.deep.equal(grey);
    });

    it("should not divide by zero when the background matches the overlay", () => {
        // Background is black, so a black overlay has no effect and the channel calculation is zero.
        const result = calculateOverlayColor(grey, black);

        expect(Number.isFinite(result.alpha)).to.be.true;
        expect(result.components[0]).to.equal(1);
    });
});

describe("asOverlay", () => {
    it("should create a white overlay for a lighter color", () => {
        const result = asOverlay(lightGrey, grey);

        expect(result.components).to.deep.equal([1, 1, 1]);
        expect(result.alpha).to.equal(0.5);
    });

    it("should create a black overlay for a darker color", () => {
        const result = asOverlay(darkGrey, grey);

        expect(result.components).to.deep.equal([0, 0, 0]);
        expect(result.alpha).to.equal(0.5);
    });

    it("should keep the intended color and its relative luminance", () => {
        const result = asOverlay(lightGrey, grey);

        expect(result.intendedColor).to.equal(lightGrey);
        expect(colorLuminance(result)).to.equal(colorLuminance(lightGrey));
    });

    it("should calculate against the intended color of an overlay reference", () => {
        const overlay = asOverlay(lightGrey, grey);
        // Using the intended opaque color (lightGrey), black at 1/3 gets to 0.5 grey.
        const result = asOverlay(darkGrey, overlay);
        const expected = asOverlay(darkGrey, lightGrey);

        expect(result.components).to.deep.equal(expected.components);
        expect(result.alpha).to.equal(expected.alpha);
    });

    it("should use the match color when over a transparent reference", () => {
        const result = asOverlay(grey, transparent);

        expect(result.alpha).to.equal(grey.alpha);
    });
});

describe("colorAsOverlay", () => {
    it("should return null for a null color", () => {
        expect(colorAsOverlay(null, grey, true)).to.be.null;
        expect(colorAsOverlay(null, grey, false)).to.be.null;
    });

    it("should return the same color when not an overlay", () => {
        expect(colorAsOverlay(lightGrey, grey, false)).to.equal(lightGrey);
    });

    it("should return a semitransparent color when an overlay", () => {
        const result = colorAsOverlay(lightGrey, grey, true)!;

        expect(result).not.to.equal(lightGrey);
        expect(result.alpha).to.equal(0.5);
        expect(colorLuminance(result)).to.equal(colorLuminance(lightGrey));
        expect((result as OverlayColor).intendedColor).to.equal(lightGrey);
    });
});

describe("colorSetAsOverlay", () => {
    const set: InteractiveColorSet = {
        rest: lightGrey,
        hover: darkGrey,
        active: white,
        focus: null,
        disabled: black,
    };

    it("should return the same set when not an overlay", () => {
        expect(colorSetAsOverlay(set, grey, false)).to.equal(set);
    });

    it("should convert each state to an overlay", () => {
        const result = colorSetAsOverlay(set, grey, true);

        expect(result).not.to.equal(set);
        expect(result.rest!.components).to.deep.equal([1, 1, 1]);
        expect(result.rest!.alpha).to.equal(0.5);
        expect(result.hover!.components).to.deep.equal([0, 0, 0]);
        expect(result.hover!.alpha).to.equal(0.5);
        expect(result.active!.components).to.deep.equal([1, 1, 1]);
        expect(result.active!.alpha).to.equal(1);
        expect(result.disabled!.components).to.deep.equal([0, 0, 0]);
        expect(result.disabled!.alpha).to.equal(1);
    });

    it("should not have a state that the set doesn't have", () => {
        const result = colorSetAsOverlay({ rest: lightGrey, focus: null }, grey, true);

        expect(Object.keys(result)).to.deep.equal(["rest", "focus"]);
    });

    it("should preserve null states", () => {
        expect(colorSetAsOverlay(set, grey, true).focus).to.be.null;
    });
});
