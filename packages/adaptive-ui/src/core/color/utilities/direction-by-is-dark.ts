import { PaletteDirection } from "../palette.js";
import { Paint } from "../paint.js";
import { isDark } from "./is-dark.js";

/**
 * Gets an inverse directional multiplier based on whether the `color` is dark or light.
 *
 * @param color - The color to check
 * @returns `darker` if the `color` is light, `lighter` if the `color` is dark
 *
 * @public
 */
export function directionByIsDark(color: Paint): PaletteDirection {
    return isDark(color) ? PaletteDirection.lighter : PaletteDirection.darker;
}
