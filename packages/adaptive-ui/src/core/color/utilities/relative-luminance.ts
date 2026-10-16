import { colorLuminance } from "../color.js";
import { isDtcgGradient } from "../gradient.js";
import { isGradient, Paint } from "../paint.js";

/**
 * Gets the relative luminance of a paint.
 *
 * @remarks
 * The relative luminance of a gradient is that of its first stop, this assumes the stops have similar luminance.
 *
 * @param paint - The color or gradient
 * @returns A number between 0 and 1, calculated by {@link https://www.w3.org/WAI/GL/wiki/Relative_luminance}
 *
 * @public
 */
export function relativeLuminance(paint: Paint): number {
    return colorLuminance(isGradient(paint) ? (isDtcgGradient(paint) ? paint[0].color : paint.stops[0].color) : paint);
}

/**
 * Gets the contrast ratio between two paints.
 *
 * For example, the contrast between #FFFFFF and #767676 is 4.5:1
 *
 * @param a - One color or gradient
 * @param b - Another color or gradient
 * @returns The contrast between the two paints, for example, 4.54
 *
 * @public
 */
export function contrast(a: Paint, b: Paint): number {
    const luminanceA = relativeLuminance(a);
    const luminanceB = relativeLuminance(b);
    const y1 = luminanceA > luminanceB ? luminanceA : luminanceB;
    const y2 = luminanceA > luminanceB ? luminanceB : luminanceA;

    return (y1 + 0.05) / (y2 + 0.05);
}
