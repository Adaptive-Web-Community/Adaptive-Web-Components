import { InteractiveSet, mapStates } from "../../interactive.js";
import { Paint } from "../paint.js";
import { closestSwatchIndex, Palette } from "../palette.js";

/**
 * Inverts the deltas of an interactive set when they would go beyond the end of the palette.
 *
 * @param palette - The Palette the deltas apply to
 * @param reference - The reference color
 * @param deltas - The offsets of the states from `reference`, of which the states that have an offset are checked
 * @returns The `deltas` if the rest, hover, active, and focus states are within the palette, or the deltas moving the
 * other direction
 *
 * @public
 */
export function invertingPaletteDeltasForSet(palette: Palette, reference: Paint, deltas: InteractiveSet<number>): InteractiveSet<number> {
    const referenceIndex = closestSwatchIndex(palette, reference);

    // Check if the indices the deltas will hit are all within palette bounds
    const withinBounds = [deltas.rest, deltas.hover, deltas.active, deltas.focus]
        .filter((delta): delta is number => typeof delta === "number")
        .map(delta => referenceIndex + delta)
        .every(index => index >= 0 && index < palette.swatches.length);

    if (withinBounds) {
        return deltas;
    }

    // The offset of other deltas from the rest delta, which is where the rest is if it has none
    const restDelta = deltas.rest ?? 0;
    const flippedRestDelta = restDelta * -1;

    return mapStates(deltas, delta => flippedRestDelta + (delta - restDelta));
}
