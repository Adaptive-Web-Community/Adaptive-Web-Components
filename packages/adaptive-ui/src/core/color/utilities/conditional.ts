import { InteractiveSwatchSet } from "../recipe.js";
import { _white } from "./color-constants.js";

const transparentWhite = _white.toTransparent();

/**
 * Return an interactive set of the provided tokens or a no-op "transparent" set of tokens.
 *
 * @param set - The swatch set to return if the condition is true.
 * @param condition - The condition.
 * @returns The provided swatch set or a "transparent" swatch set.
 */
export function conditionalSwatchSet(
    set: InteractiveSwatchSet,
    condition: boolean
): InteractiveSwatchSet {
    if (condition) {
        return set;
    }

    return {
        rest: transparentWhite,
        hover: transparentWhite,
        active: transparentWhite,
        focus: transparentWhite,
        disabled: transparentWhite,
    };
}
