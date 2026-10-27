import type { DefaultAria } from "../utilities/aria.js";
import type { Orientation } from "../utilities/orientation.js";

/**
 * A divider: a line that separates content (`role="separator"`). An author who means it as decoration only gives it `role="presentation"`,
 * which overrides the default role.
 *
 * @remarks
 * Slots: the default slot.
 *
 * @public
 */
export interface DividerElement extends HTMLElement {
    /**
     * The direction of the line.
     *
     * @remarks
     * HTML attribute: `orientation`. The default is `horizontal`.
     */
    orientation: Orientation;
}

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
