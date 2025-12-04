import { type Color as CuloriColor, modeRgb, type Rgb, useMode } from "culori/fn";
import { Color } from "../color.js";
import { InteractiveColorSet } from "../recipe.js";

const rgb = useMode(modeRgb);

const rgbBlack: Rgb = { mode: "rgb", r: 0, g: 0, b: 0 };
const rgbWhite: Rgb = { mode: "rgb", r: 1, g: 1, b: 1 };

function calcChannelOverlay(match: number, background: number, overlay: number): number {
    if (overlay - background === 0) {
        return 0;
    } else {
        return (match - background) / (overlay - background);
    }
}

function calcRgbOverlay(rgbMatch: Rgb, rgbBackground: Rgb, rgbOverlay: Rgb): number {
    const rChannel: number = calcChannelOverlay(rgbMatch.r, rgbBackground.r, rgbOverlay.r);
    const gChannel: number = calcChannelOverlay(rgbMatch.g, rgbBackground.g, rgbOverlay.g);
    const bChannel: number = calcChannelOverlay(rgbMatch.b, rgbBackground.b, rgbOverlay.b);
    return (rChannel + gChannel + bChannel) / 3;
}

/**
 * Calculate an overlay color that uses rgba (rgb + alpha) that matches the appearance of a given solid color
 * when placed on the same background.
 *
 * @param match - The solid color the overlay should match in appearance when placed over the rgbBackground
 * @param background - The background on which the overlay rests
 * @returns The rgba (rgb + alpha) color of the overlay
 *
 * @public
 */
export function calculateOverlayColor(match: CuloriColor, background: CuloriColor): Rgb {
    const rgbMatch = rgb(match);

    if (Color.isTransparent(rgbMatch) || Color.isTransparent(background)) {
        return rgbMatch;
    }

    const rgbBackground = rgb(background);
    let overlay = rgbBlack;
    let alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    if (alpha <= 0) {
        overlay = rgbWhite;
        alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    }
    alpha = Math.round(alpha * 1000) / 1000;

    return Object.assign({}, overlay, { alpha });
}

/**
 * Returns an opaque {@link Color} or a {@link Color} with opacity relative to the reference color.
 *
 * @param color - The opaque intended swatch color.
 * @param reference - The reference color for a semitransparent swatch.
 * @param asOverlay - True to return a semitransparent representation of `swatch` relative to `reference`.
 * @returns The requested representation of `swatch`.
 *
 * @public
 */
export function swatchAsOverlay(color: Color | null, reference: Color, asOverlay: boolean): Color | null {
    return color && asOverlay
        ? Color.asOverlay(color, reference)
        : color;
}

/**
 * Returns an interactive set of opaque {@link Color}s or {@link Color}s with opacity relative to the reference color.
 *
 * @param set - The swatch set for which to make overlay.
 * @param reference - The reference color for a semitransparent swatch.
 * @param asOverlay - True to return a semitransparent representation of `swatch` relative to `reference`.
 * @returns The requested representation of a `swatch` set.
 *
 * @public
 */
export function interactiveSwatchSetAsOverlay(
    set: InteractiveColorSet,
    reference: Color,
    asOverlay: boolean
): InteractiveColorSet {
    if (asOverlay) {
        return {
            rest: swatchAsOverlay(set.rest, reference, asOverlay),
            hover: swatchAsOverlay(set.hover, reference, asOverlay),
            active: swatchAsOverlay(set.active, reference, asOverlay),
            focus: swatchAsOverlay(set.focus, reference, asOverlay),
            disabled: swatchAsOverlay(set.disabled, reference, asOverlay),
        };
    }
    return set;
}
