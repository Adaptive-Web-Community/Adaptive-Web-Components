import { InteractiveValues } from "../../interactive.js";
import { Paint } from "../paint.js";
import { closestSwatchIndex, Palette } from "../palette.js";

/**
 * Inverts the deltas of an interactive set when they would go beyond the end of the palette.
 *
 * @param palette - The Palette the deltas apply to
 * @param reference - The reference color
 * @param deltas - The offsets of each state from `reference`
 * @returns The `deltas` if the rest, hover, active, and focus states are within the palette, or the deltas moving the
 * other direction
 *
 * @public
 */
export function invertingPaletteDeltasForSet(
    palette: Palette,
    reference: Paint,
    deltas: InteractiveValues<number>
): InteractiveValues<number> {
    const referenceIndex = closestSwatchIndex(palette, reference);

    // Check if the indices the deltas will hit are all within palette bounds
    const withinBounds = [deltas.rest, deltas.hover, deltas.active, deltas.focus]
        .map(delta => referenceIndex + delta)
        .every(index => index >= 0 && index < palette.swatches.length);

    if (withinBounds) {
        return deltas;
    }

    // The offset of other deltas from the rest delta
    const flippedRestDelta = deltas.rest * -1;

    return {
        rest: flippedRestDelta,
        hover: flippedRestDelta + (deltas.hover - deltas.rest),
        active: flippedRestDelta + (deltas.active - deltas.rest),
        focus: flippedRestDelta + (deltas.focus - deltas.rest),
        disabled: flippedRestDelta + (deltas.disabled - deltas.rest),
    };
}
