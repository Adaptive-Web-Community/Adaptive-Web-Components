import { modeRgb, type Rgb, useMode } from "culori/fn";
import { Color, fromCulori, isTransparent, OverlayColor, toCulori } from "../color.js";
import { mapStates } from "../../interactive.js";
import { InteractiveColorSet } from "../interactive-set.js";

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
 * @param match - The solid color the overlay should match in appearance when placed over the background
 * @param background - The background on which the overlay rests
 * @returns The rgba (rgb + alpha) color of the overlay
 *
 * @public
 */
export function calculateOverlayColor(match: Color, background: Color): Color {
    const rgbMatch = rgb(toCulori(match));

    if (isTransparent(match) || isTransparent(background)) {
        return fromCulori(rgbMatch);
    }

    const rgbBackground = rgb(toCulori(background));
    let overlay = rgbBlack;
    let alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    if (alpha <= 0) {
        overlay = rgbWhite;
        alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    }
    alpha = Math.round(alpha * 1000) / 1000;

    return fromCulori(Object.assign({}, overlay, { alpha }));
}

/**
 * Creates a semitransparent color that looks like the `intendedColor` over `reference`.
 *
 * @remarks
 * Currently the overlay will only be black or white, so this works best with a plain grey neutral palette.
 * Otherwise it will attempt to match the luminance value of the color, so it will likely be close, but not an
 * exact match to the color from another palette.
 *
 * The relative luminance of the result is that of the `intendedColor`.
 *
 * @param intendedColor - The color the overlay should look like over the `reference` color.
 * @param reference - The color under the overlay color.
 * @returns A semitransparent color that represents the `intendedColor` over the `reference` color.
 *
 * @public
 */
export function asOverlay(intendedColor: Color, reference: Color): OverlayColor {
    const referenceColor = "intendedColor" in reference ? (reference as OverlayColor).intendedColor : reference;
    return Object.freeze({ ...calculateOverlayColor(intendedColor, referenceColor), intendedColor });
}

/**
 * Returns an opaque {@link Color} or a {@link Color} with opacity relative to the reference color.
 *
 * @param color - The opaque intended color.
 * @param reference - The reference color for a semitransparent color.
 * @param overlay - True to return a semitransparent representation of `color` relative to `reference`.
 * @returns The requested representation of `color`.
 *
 * @public
 */
export function colorAsOverlay(color: Color | null, reference: Color, overlay: boolean): Color | null {
    return color && overlay ? asOverlay(color, reference) : color;
}

/**
 * Returns an interactive set of opaque {@link Color}s or {@link Color}s with opacity relative to the reference color.
 *
 * @param set - The color set for which to make overlay.
 * @param reference - The reference color for a semitransparent color.
 * @param overlay - True to return a semitransparent representation of the colors relative to `reference`.
 * @returns The requested representation of a color set.
 *
 * @public
 */
export function colorSetAsOverlay(set: InteractiveColorSet, reference: Color, overlay: boolean): InteractiveColorSet {
    if (overlay) {
        return mapStates(set, color => asOverlay(color, reference));
    }
    return set;
}
