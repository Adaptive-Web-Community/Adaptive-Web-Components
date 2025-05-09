import { Color } from "../color.js";
import { InteractiveColorSet } from "../recipe.js";
import { _white } from "./color-constants.js";

const _transparentWhite = Color.unsafeOpacity(_white, 0);

/**
 * Return an interactive set of the provided tokens or a no-op "transparent" set of tokens.
 *
 * @param set - The swatch set to return if the condition is true.
 * @param condition - The condition.
 * @returns The provided swatch set or a "transparent" swatch set.
 */
export function conditionalSwatchSet(
    set: InteractiveColorSet,
    condition: boolean
): InteractiveColorSet {
    if (condition) {
        return set;
    }

    return {
        rest: _transparentWhite,
        hover: _transparentWhite,
        active: _transparentWhite,
        focus: _transparentWhite,
        disabled: _transparentWhite,
    };
}
