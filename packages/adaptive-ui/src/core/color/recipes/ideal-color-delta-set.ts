import { InteractiveValues } from "../../interactive.js";
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
 * @param deltas - The offsets of each state. The rest and hover offsets decide which of the two has the
 * accessible color, the active and focus offsets are from the rest state and the disabled offset from `reference`.
 * @param options - The palette for the disabled color, and the direction the deltas move on the `palette` (defaults
 * to {@link directionByIsDark} based on `reference`)
 * @returns The interactive set of Colors
 *
 * @public
 */
export function idealColorDeltaSet(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    idealColor: Color,
    deltas: InteractiveValues<number>,
    options: Omit<ColorSetOptions, "zeroAsTransparent"> = {}
): InteractiveColorSet {
    const { disabledPalette = palette, direction = directionByIsDark(reference) } = options;

    const referenceIndex = closestSwatchIndex(palette, reference);
    const idealIndex = closestSwatchIndex(palette, idealColor);
    const startIndex =
        idealIndex +
        (direction === PaletteDirection.darker
            ? Math.min(deltas.rest, deltas.hover)
            : Math.max(direction * deltas.rest, direction * deltas.hover));
    const accessibleColor = contrastColor(palette, reference, minContrast, direction, startIndex);

    const accessibleIndex1 = closestSwatchIndex(palette, accessibleColor);
    const accessibleIndex2 = accessibleIndex1 + direction * Math.abs(deltas.rest - deltas.hover);
    const indexOneIsRestState =
        direction === PaletteDirection.darker ? deltas.rest < deltas.hover : direction * deltas.rest > direction * deltas.hover;

    let restIndex: number;
    let hoverIndex: number;

    if (indexOneIsRestState) {
        restIndex = accessibleIndex1;
        hoverIndex = accessibleIndex2;
    } else {
        restIndex = accessibleIndex2;
        hoverIndex = accessibleIndex1;
    }

    return {
        rest: swatchAt(palette, restIndex),
        hover: swatchAt(palette, hoverIndex),
        active: swatchAt(palette, restIndex + direction * deltas.active),
        focus: swatchAt(palette, restIndex + direction * deltas.focus),
        disabled: swatchAt(disabledPalette, referenceIndex + direction * deltas.disabled),
    };
}
