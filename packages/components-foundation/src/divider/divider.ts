import type { DefaultAria } from "../utilities/aria.js";
import type { DividerContract } from "./divider.generated.js";

/**
 * A divider: a line that separates content (`role="separator"`). An author who means it as decoration only gives it `role="presentation"`,
 * which overrides the default role.
 *
 * @remarks
 * Slots: the default slot.
 *
 * @public
 */
export interface DividerElement extends HTMLElement, DividerContract {}

/**
 * The default ARIA of a divider: the `separator` role, in its orientation.
 *
 * @public
 */
export function dividerAria(divider: DividerElement): DefaultAria {
    return {
        role: "separator",
        ariaOrientation: divider.orientation,
    };
}
