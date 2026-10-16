import { InteractiveValues } from "../../interactive.js";
import { Color } from "../color.js";
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
 * @param deltas - The offsets of each state. The rest and hover offsets decide which of the two has the
 * accessible color, the active and focus offsets are from the rest state and the disabled offset from `reference`.
 * @param options - The palette for the disabled color, the direction the deltas move on the `palette` (defaults to
 * {@link directionByIsDark} based on `reference`), and whether to treat the color at the reference as transparent
 * @returns The interactive set of Colors
 *
 * @public
 */
export function contrastAndDeltaColorSet(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    deltas: InteractiveValues<number>,
    options: ColorSetOptions = {}
): InteractiveColorSet {
    const { disabledPalette = palette, direction = directionByIsDark(reference), zeroAsTransparent = false } = options;

    const referenceIndex = closestSwatchIndex(palette, reference);
    const accessibleColor = contrastColor(palette, reference, minContrast, direction, referenceIndex);

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

    function getColor(palette: Palette, index: number): Color {
        const color = swatchAt(palette, index);
        if (zeroAsTransparent === true && index === referenceIndex) {
            return asOverlay(color, color);
        } else {
            return color;
        }
    }

    return {
        rest: getColor(palette, restIndex),
        hover: getColor(palette, hoverIndex),
        active: getColor(palette, restIndex + direction * deltas.active),
        focus: getColor(palette, restIndex + direction * deltas.focus),
        disabled: getColor(disabledPalette, referenceIndex + direction * deltas.disabled),
    };
}
