import { Color } from "../color.js";
import { InteractiveValues } from "../../interactive.js";
import { ColorSetOptions, InteractiveColorSet } from "../interactive-set.js";
import { Paint } from "../paint.js";
import { closestSwatchIndex, Palette, swatchAt } from "../palette.js";
import { asOverlay } from "../utilities/opacity.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets an interactive set of Colors the specified positions away from the reference color.
 *
 * @param palette - The Palette used to find the Colors
 * @param reference - The reference color
 * @param deltas - The offsets of each state from `reference`
 * @param options - The palette for the disabled color, the direction the deltas move on the `palette` (defaults to
 * {@link directionByIsDark} based on `reference`), and whether to treat a zero offset as transparent
 * @returns The interactive set of Colors
 *
 * @public
 */
export function deltaColorSet(
    palette: Palette,
    reference: Paint,
    deltas: InteractiveValues<number>,
    options: ColorSetOptions = {}
): InteractiveColorSet {
    const { disabledPalette = palette, direction = directionByIsDark(reference), zeroAsTransparent = false } = options;
    const referenceIndex = closestSwatchIndex(palette, reference);

    function getColor(palette: Palette, delta: number): Color {
        const color = swatchAt(palette, referenceIndex + direction * delta);
        if (zeroAsTransparent === true && delta === 0) {
            return asOverlay(color, color);
        } else {
            return color;
        }
    }

    return {
        rest: getColor(palette, deltas.rest),
        hover: getColor(palette, deltas.hover),
        active: getColor(palette, deltas.active),
        focus: getColor(palette, deltas.focus),
        disabled: getColor(disabledPalette, deltas.disabled),
    };
}
