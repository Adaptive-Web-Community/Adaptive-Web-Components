import { InteractiveValues } from "../../types.js";
import { Palette } from "../palette.js";
import { RelativeLuminance } from "../utilities/relative-luminance.js";

/**
 * Checks if the supplied delta set for palette access is valid, or flips sign if not to keep deltas in bounds.
 * 
 * Returns a new set of deltas so the indices for all states (rest, hover, active, focus) are in bounds.
 * Flipping is always based on the rest delta; the other deltas are adjusted to preserve their *relative* difference to rest.
 *
 * @param palette - The Palette used to find the Colors
 * @param reference - The reference color
 * @param restDelta - The rest state offset from `reference`
 * @param hoverDelta - The hover state offset from `reference`
 * @param activeDelta - The active state offset from `reference`
 * @param focusDelta - The focus state offset from `reference`
 * @param disabledDelta - The disabled state offset from `reference`
 * @returns An interactive set of deltas with possibly flipped and shifted values
 *
 * @public
 */
export function invertingPaletteDeltasForSet(palette: Palette, reference: RelativeLuminance, restDelta: number, hoverDelta: number, activeDelta: number, focusDelta: number, disabledDelta: number): InteractiveValues<number> {
    const referenceIndex = palette.closestIndexOf(reference);
    const deltas = [restDelta, hoverDelta, activeDelta, focusDelta];

    // Compute the indices they'll hit
    const indices = deltas.map(d => referenceIndex + d);

    // Check if all indices are within palette bounds
    const withinBounds = indices.every(idx => idx >= 0 && idx < palette.swatches.length);

    if (withinBounds) {
        // All are in bounds as-is
        return {
            rest: restDelta,
            hover: hoverDelta,
            active: activeDelta,
            focus: focusDelta,
            disabled: disabledDelta,
        };
    }

    // The offset of other deltas from restDelta
    const hoverOffset = hoverDelta - restDelta;
    const activeOffset = activeDelta - restDelta;
    const focusOffset = focusDelta - restDelta;
    const disabledOffset = disabledDelta - restDelta;

    const flippedRestDelta = restDelta * -1;

    return {
        rest: flippedRestDelta,
        hover: flippedRestDelta + hoverOffset,
        active: flippedRestDelta + activeOffset,
        focus: flippedRestDelta + focusOffset,
        disabled: flippedRestDelta + disabledOffset,
    };
}
