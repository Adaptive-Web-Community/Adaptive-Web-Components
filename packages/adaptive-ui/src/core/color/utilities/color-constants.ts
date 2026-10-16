import { Color, rgbColor } from "../color.js";

/**
 * Opaque white.
 *
 * @public
 */
export const white: Color = rgbColor(1, 1, 1);

/**
 * Opaque black.
 *
 * @public
 */
export const black: Color = rgbColor(0, 0, 0);

/**
 * Fully transparent, the `transparent` of CSS.
 *
 * @public
 */
export const transparent: Color = rgbColor(0, 0, 0, 0);
