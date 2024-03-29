import { InteractiveSwatchSet } from "../recipe.js";
import { Swatch } from "../swatch.js";

/**
 * Returns an opaque {@link Swatch} or a {@link Swatch} with opacity relative to the reference color.
 *
 * @param swatch - The opaque intended swatch color.
 * @param reference - The reference color for a semitransparent swatch.
 * @param asOverlay - True to return a semitransparent representation of `swatch` relative to `reference`.
 * @returns The requested representation of `swatch`.
 *
 * @public
 */
export function swatchAsOverlay(swatch: Swatch | null, reference: Swatch, asOverlay: boolean): Swatch | null {
    return swatch && asOverlay
        ? Swatch.asOverlay(swatch, reference)
        : swatch;
}

/**
 * Returns an interactive set of opaque {@link Swatch}es or {@link Swatch}es with opacity relative to the reference color.
 *
 * @param set - The swatch set for which to make overlay.
 * @param reference - The reference color for a semitransparent swatch.
 * @param asOverlay - True to return a semitransparent representation of `swatch` relative to `reference`.
 * @returns The requested representation of a `swatch` set.
 *
 * @public
 */
export function interactiveSwatchSetAsOverlay(
    set: InteractiveSwatchSet,
    reference: Swatch,
    asOverlay: boolean
): InteractiveSwatchSet {
    if (asOverlay) {
        return {
            rest: swatchAsOverlay(set.rest, reference, asOverlay),
            hover: swatchAsOverlay(set.hover, reference, asOverlay),
            active: swatchAsOverlay(set.active, reference, asOverlay),
            focus: swatchAsOverlay(set.focus, reference, asOverlay),
            disabled: swatchAsOverlay(set.disabled, reference, asOverlay),
        };
    }
    return set;
}
