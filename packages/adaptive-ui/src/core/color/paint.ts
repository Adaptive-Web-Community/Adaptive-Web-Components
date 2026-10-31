import { Color, formatColor } from "./color.js";
import { DtcgGradient, formatGradient, Gradient } from "./gradient.js";

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
    return Array.isArray(paint) || "stops" in paint;
}

/**
 * Checks if a value is a paint: a color, a {@link Gradient}, or a {@link DtcgGradient}.
 *
 * @remarks
 * The values are plain data, so the shape tells what one is: a color has a `colorSpace`, a gradient its `stops`, and a DTCG gradient is a
 * list of stops, each with a `color` and a `position`.
 *
 * @param value - The value to check
 * @returns True if the value is a paint
 *
 * @public
 */
export function isPaint(value: unknown): value is Paint {
    if (Array.isArray(value)) {
        return value.length > 0 && value.every(stop => typeof stop === "object" && stop !== null && "color" in stop && "position" in stop);
    }
    return typeof value === "object" && value !== null && ("colorSpace" in value || "stops" in value);
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
