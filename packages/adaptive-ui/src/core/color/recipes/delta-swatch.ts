import { Color } from "../color.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Color algorithm to get the Color a specified position away from the reference color.
 *
 * @param palette - The Palette used to find the Color
 * @param reference - The reference color
 * @param delta - The offset from the `reference`
 * @param direction - The direction the delta moves on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @returns The Color
 *
 * @public
 */
export function deltaSwatch(
    palette: Palette,
    reference: Paint,
    delta: number,
    direction: PaletteDirection = directionByIsDark(reference)
): Color {
    return palette.delta(reference, delta, direction);
}
