import { transparent } from "../color.js";
import { InteractiveColorSet } from "../interactive-set.js";

/**
 * Returns the provided set, or a set of transparent colors when the condition isn't met.
 *
 * @param set - The color set to use when the condition is met
 * @param condition - Whether to use the set
 * @returns The set, or a transparent set
 *
 * @public
 */
export function conditionalColorSet(set: InteractiveColorSet, condition: boolean): InteractiveColorSet {
    if (condition) {
        return set;
    }

    return {
        rest: transparent,
        hover: transparent,
        active: transparent,
        focus: transparent,
        disabled: transparent,
    };
}
