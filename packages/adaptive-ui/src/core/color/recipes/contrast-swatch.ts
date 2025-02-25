import { Color } from "../color.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets a Color meeting the minimum contrast from the reference color.
 *
 * @param palette - The Palette used to find the Color
 * @param reference - The reference color
 * @param minContrast - The desired minimum contrast
 * @param direction - The direction the delta moves on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @returns The Color
 *
 * @public
 */
export function contrastSwatch(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    direction: PaletteDirection = directionByIsDark(reference)
): Color {
    return palette.colorContrast(reference, minContrast, undefined, direction);
}
