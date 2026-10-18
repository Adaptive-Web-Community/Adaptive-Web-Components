import { InteractiveSet, InteractiveState, mapStates } from "../../interactive.js";
import { ColorSetOptions, InteractiveColorSet } from "../interactive-set.js";
import { Paint } from "../paint.js";
import { closestSwatchIndex, Palette, swatchAt } from "../palette.js";
import { PaletteDirection } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";
import { asOverlay } from "../utilities/opacity.js";
import { contrastColor } from "./contrast-color.js";

/**
 * Gets an interactive set of Colors starting from a color that meets the minimum contrast, with the other states
 * offset from it.
 *
 * @param palette - The Palette used to find the Colors
 * @param reference - The reference color
 * @param minContrast - The minimum contrast from `reference`
 * @param deltas - The offsets of the states, which has a Color for each state that has an offset. The rest and hover offsets decide which of the two
 * has the accessible color (a state that has no offset is where the rest is), the active and focus offsets are from the rest state and the disabled
 * offset from `reference`.
 * @param options - The palette for the disabled color, the direction the deltas move on the `palette` (defaults to
 * {@link directionByIsDark} based on `reference`), and whether to treat the color at the reference as transparent
 * @returns The interactive set of Colors, for the states that have a delta
 *
 * @public
 */
export function contrastAndDeltaColorSet(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    deltas: InteractiveSet<number>,
    options: ColorSetOptions = {}
): InteractiveColorSet {
    const { disabledPalette = palette, direction = directionByIsDark(reference), zeroAsTransparent = false } = options;

    const referenceIndex = closestSwatchIndex(palette, reference);
    const accessibleColor = contrastColor(palette, reference, minContrast, direction, referenceIndex);

    // The rest and hover place the accessible color, and a state that has no delta is where the rest is.
    const restDelta = deltas.rest ?? 0;
    const hoverDelta = deltas.hover ?? restDelta;
    const accessibleIndex1 = closestSwatchIndex(palette, accessibleColor);
    const accessibleIndex2 = accessibleIndex1 + direction * Math.abs(restDelta - hoverDelta);
    const indexOneIsRestState =
        direction === PaletteDirection.darker ? restDelta < hoverDelta : direction * restDelta > direction * hoverDelta;

    const restIndex = indexOneIsRestState ? accessibleIndex1 : accessibleIndex2;
    const hoverIndex = indexOneIsRestState ? accessibleIndex2 : accessibleIndex1;

    const indexOf = (state: InteractiveState, delta: number): number => {
        switch (state) {
            case InteractiveState.rest:
                return restIndex;
            case InteractiveState.hover:
                return hoverIndex;
            case InteractiveState.disabled:
                return referenceIndex + direction * delta;
            default:
                return restIndex + direction * delta;
        }
    };

    return mapStates(deltas, (delta, state) => {
        const index = indexOf(state, delta);
        const color = swatchAt(state === InteractiveState.disabled ? disabledPalette : palette, index);
        return zeroAsTransparent === true && index === referenceIndex ? asOverlay(color, color) : color;
    });
}
