import { InteractiveSwatchSet } from "../recipe.js";
import { SwatchRGB } from "../swatch.js";
import { _white } from "./color-constants.js";

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

    const transparent = SwatchRGB.asOverlay(_white, _white);
    return {
        rest: transparent,
        hover: transparent,
        active: transparent,
        focus: transparent,
    };
}
