import { InteractiveSet, InteractiveState, mapStates } from "../../interactive.js";
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
 * @param deltas - The offsets of the states from `reference`, which has a Color for each state that has an offset
 * @param options - The palette for the disabled color, the direction the deltas move on the `palette` (defaults to
 * {@link directionByIsDark} based on `reference`), and whether to treat a zero offset as transparent
 * @returns The interactive set of Colors, for the states that have a delta
 *
 * @public
 */
export function deltaColorSet(
    palette: Palette,
    reference: Paint,
    deltas: InteractiveSet<number>,
    options: ColorSetOptions = {}
): InteractiveColorSet {
    const { disabledPalette = palette, direction = directionByIsDark(reference), zeroAsTransparent = false } = options;
    const referenceIndex = closestSwatchIndex(palette, reference);

    return mapStates(deltas, (delta, state) => {
        const color = swatchAt(state === InteractiveState.disabled ? disabledPalette : palette, referenceIndex + direction * delta);
        return zeroAsTransparent === true && delta === 0 ? asOverlay(color, color) : color;
    });
}
