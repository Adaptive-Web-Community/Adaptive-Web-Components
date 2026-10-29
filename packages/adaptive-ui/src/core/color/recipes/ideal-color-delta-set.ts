import { InteractiveSet, InteractiveState, mapStates } from "../../interactive.js";
import { Color } from "../color.js";
import { ColorSetOptions, InteractiveColorSet } from "../interactive-set.js";
import { Paint } from "../paint.js";
import { closestSwatchIndex, Palette, PaletteDirection, swatchAt } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";
import { contrastColor } from "./contrast-color.js";

/**
 * Gets an interactive set of Colors starting from the ideal color if it meets the minimum contrast, or the closest
 * color that does, with the other states offset from it.
 *
 * @param palette - The Palette used to find the Colors
 * @param reference - The reference color
 * @param minContrast - The minimum contrast from `reference`
 * @param idealColor - The color to start from if it has the minimum contrast
 * @param deltas - The offsets of the states, which has a Color for each state that has an offset. The rest and hover offsets decide which of the two
 * has the accessible color (a state that has no offset is where the rest is), the active and focus offsets are from the rest state and the disabled
 * offset from `reference`.
 * @param options - The palette for the disabled color, and the direction the deltas move on the `palette` (defaults
 * to {@link directionByIsDark} based on `reference`)
 * @returns The interactive set of Colors, for the states that have a delta
 *
 * @public
 */
export function idealColorDeltaSet(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    idealColor: Color,
    deltas: InteractiveSet<number>,
    options: Omit<ColorSetOptions, "zeroAsTransparent"> = {}
): InteractiveColorSet {
    const { disabledPalette = palette, direction = directionByIsDark(reference) } = options;

    const referenceIndex = closestSwatchIndex(palette, reference);
    const idealIndex = closestSwatchIndex(palette, idealColor);
    const restDelta = deltas.rest ?? 0;
    const hoverDelta = deltas.hover ?? restDelta;
    const startIndex =
        idealIndex +
        (direction === PaletteDirection.darker
            ? Math.min(restDelta, hoverDelta)
            : Math.max(direction * restDelta, direction * hoverDelta));
    const accessibleColor = contrastColor(palette, reference, minContrast, direction, startIndex);

    const accessibleIndex1 = closestSwatchIndex(palette, accessibleColor);
    const accessibleIndex2 = accessibleIndex1 + direction * Math.abs(restDelta - hoverDelta);
    const indexOneIsRestState =
        direction === PaletteDirection.darker ? restDelta < hoverDelta : direction * restDelta > direction * hoverDelta;

    const restIndex = indexOneIsRestState ? accessibleIndex1 : accessibleIndex2;
    const hoverIndex = indexOneIsRestState ? accessibleIndex2 : accessibleIndex1;

    return mapStates(deltas, (delta, state) => {
        switch (state) {
            case InteractiveState.rest:
                return swatchAt(palette, restIndex);
            case InteractiveState.hover:
                return swatchAt(palette, hoverIndex);
            case InteractiveState.disabled:
                return swatchAt(disabledPalette, referenceIndex + direction * delta);
            default:
                return swatchAt(palette, restIndex + direction * delta);
        }
    });
}
