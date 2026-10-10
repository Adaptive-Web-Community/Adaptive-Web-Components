import chai from "chai";
import { Color } from "../color.js";
import { InteractiveColorSet } from "../recipe.js";
import { _black, _white } from "./color-constants.js";
import { calculateOverlayColor, interactiveSwatchSetAsOverlay, swatchAsOverlay } from "./opacity.js";

const { expect } = chai;

const lightGrey = Color.fromRgb(0.75, 0.75, 0.75);
const grey = Color.fromRgb(0.5, 0.5, 0.5);
const darkGrey = Color.fromRgb(0.25, 0.25, 0.25);

describe("calculateOverlayColor", () => {
    it("should use a black overlay to darken the background", () => {
        const result = calculateOverlayColor(darkGrey.color, grey.color);

        expect(result).to.deep.equal({ mode: "rgb", r: 0, g: 0, b: 0, alpha: 0.5 });
    });

    it("should use a white overlay to lighten the background", () => {
        const result = calculateOverlayColor(lightGrey.color, grey.color);

        expect(result).to.deep.equal({ mode: "rgb", r: 1, g: 1, b: 1, alpha: 0.5 });
    });

    it("should round the alpha to three decimal places", () => {
        // (0.5 - 0.6) / (0 - 0.6) = 0.16666...
        const result = calculateOverlayColor(Color.fromRgb(0.5, 0.5, 0.5).color, Color.fromRgb(0.6, 0.6, 0.6).color);

        expect(result.alpha).to.equal(0.167);
    });

    it("should produce an overlay that composites back to the match color", () => {
        const background = Color.fromRgb(0.4, 0.4, 0.4);

        [Color.fromRgb(0.2, 0.2, 0.2), Color.fromRgb(0.7, 0.7, 0.7)].forEach(match => {
            const overlay = calculateOverlayColor(match.color, background.color);
            const composite = overlay.r * overlay.alpha! + 0.4 * (1 - overlay.alpha!);

            expect(composite).to.approximately((match.color as any).r, 0.001);
        });
    });

    it("should return the match color when it is transparent", () => {
        const result = calculateOverlayColor(Color.transparent.color, grey.color);

        expect(result.alpha).to.equal(0);
    });

    it("should return the match color when the background is transparent", () => {
        const result = calculateOverlayColor(grey.color, Color.transparent.color);

        expect(result).to.deep.equal({ ...grey.color, mode: "rgb" });
    });

    it("should not divide by zero when the background matches the overlay", () => {
        // Background is black, so a black overlay has no effect and the channel calculation is zero.
        const result = calculateOverlayColor(grey.color, _black.color);

        expect(Number.isFinite(result.alpha)).to.be.true;
        expect(result.r).to.equal(1);
    });
});

describe("swatchAsOverlay", () => {
    it("should return null for a null color", () => {
        expect(swatchAsOverlay(null, grey, true)).to.be.null;
        expect(swatchAsOverlay(null, grey, false)).to.be.null;
    });

    it("should return the same color when not an overlay", () => {
        expect(swatchAsOverlay(lightGrey, grey, false)).to.equal(lightGrey);
    });

    it("should return a semitransparent color when an overlay", () => {
        const result = swatchAsOverlay(lightGrey, grey, true)!;

        expect(result).not.to.equal(lightGrey);
        expect(result.color.alpha).to.equal(0.5);
        expect(result.relativeLuminance).to.equal(lightGrey.relativeLuminance);
    });
});

describe("interactiveSwatchSetAsOverlay", () => {
    const set: InteractiveColorSet = {
        rest: lightGrey,
        hover: darkGrey,
        active: _white,
        focus: null,
        disabled: _black,
    };

    it("should return the same set when not an overlay", () => {
        expect(interactiveSwatchSetAsOverlay(set, grey, false)).to.equal(set);
    });

    it("should convert each state to an overlay", () => {
        const result = interactiveSwatchSetAsOverlay(set, grey, true);

        expect(result).not.to.equal(set);
        expect(result.rest!.color).to.deep.equal({ mode: "rgb", r: 1, g: 1, b: 1, alpha: 0.5 });
        expect(result.hover!.color).to.deep.equal({ mode: "rgb", r: 0, g: 0, b: 0, alpha: 0.5 });
        expect(result.active!.color).to.deep.equal({ mode: "rgb", r: 1, g: 1, b: 1, alpha: 1 });
        expect(result.disabled!.color).to.deep.equal({ mode: "rgb", r: 0, g: 0, b: 0, alpha: 1 });
    });

    it("should preserve null states", () => {
        expect(interactiveSwatchSetAsOverlay(set, grey, true).focus).to.be.null;
    });
});
