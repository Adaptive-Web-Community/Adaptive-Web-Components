import { InteractiveValues } from "../interactive.js";
import { Color } from "./color.js";
import { Paint } from "./paint.js";
import { Palette, PaletteDirection } from "./palette.js";

/**
 * A set of {@link Paint}s to use for an interactive control's states.
 *
 * @public
 */
export type InteractivePaintSet = InteractiveValues<Paint | null>;

/**
 * A set of {@link Color}s to use for an interactive control's states.
 *
 * @public
 */
export type InteractiveColorSet = InteractiveValues<Color | null>;

/**
 * Options for the recipes that get a set of colors from a {@link Palette}.
 *
 * @public
 */
export interface ColorSetOptions {
    /**
     * The palette for the disabled color, defaults to the `palette` of the recipe.
     */
    disabledPalette?: Palette;

    /**
     * The direction the deltas move on the palette, defaults to `directionByIsDark` based on the `reference`.
     */
    direction?: PaletteDirection;

    /**
     * Treat a zero offset as transparent, defaults to false.
     */
    zeroAsTransparent?: boolean;
}
