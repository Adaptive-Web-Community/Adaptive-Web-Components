import { Color, formatColor } from "./color.js";
import { DtcgGradient, formatGradient, Gradient, isDtcgGradient } from "./gradient.js";

/**
 * The type of a value which can be used to paint a style like a fill or border.
 *
 * @remarks
 * A gradient may be a {@link Gradient} or a {@link DtcgGradient}, which has less.
 *
 * @public
 */
export type Paint = Color | Gradient | DtcgGradient;

/**
 * Checks if a paint is a gradient of either kind.
 *
 * @param paint - The paint to check
 * @returns True if the paint is a gradient, false if it is a color
 *
 * @public
 */
export function isGradient(paint: Paint): paint is Gradient | DtcgGradient {
    return isDtcgGradient(paint as DtcgGradient) || "stops" in paint;
}

/**
 * Gets a paint as a string for use in CSS.
 *
 * @param paint - The color or gradient
 * @returns The paint in a valid CSS string format
 *
 * @public
 */
export function formatPaint(paint: Paint): string {
    return isGradient(paint) ? formatGradient(paint) : formatColor(paint);
}
