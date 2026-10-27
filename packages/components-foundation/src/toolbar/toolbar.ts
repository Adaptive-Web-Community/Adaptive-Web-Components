import type { Orientation } from "../utilities/orientation.js";

/**
 * The parts of a {@link ToolbarElement}.
 *
 * @public
 */
export const ToolbarParts = {
    /** The container of the items, laid out in the orientation. */
    positioningRegion: "positioning-region",
} as const;

/**
 * A toolbar (`role="toolbar"`): controls of which one is in the tab order, and the arrow keys move the focus between them. Implements the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ | ARIA toolbar pattern} with {@link ToolbarController}.
 *
 * @remarks
 * Its items are the elements in its slots that take focus themselves: native controls, and hosts that are focusable (a button, a
 * checkbox), and those in a plain element around them, such as a `<label>`. A component whose focusable part is in its shadow root, such as a
 * link or a text field, isn't an item: it stays in the tab order, and the arrow keys don't move from it. Nor are the items of a component
 * that has its own, such as the radios of a radio group.
 *
 * Slots: `label` for the toolbar's label, which names it, the default slot for the items, and `start` and `end` for items before and after
 * them.
 *
 * @public
 */
export interface ToolbarElement extends HTMLElement {
    /**
     * The direction in which the items are laid out, and the arrow keys that move between them.
     *
     * @remarks
     * HTML attribute: `orientation`. The default is `horizontal`.
     */
    orientation: Orientation;
}
