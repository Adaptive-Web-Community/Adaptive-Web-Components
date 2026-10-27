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
 * Its items are the elements in its slots that take focus: native controls, hosts that are focusable (a button, a checkbox), hosts that
 * delegate their focus to a native element in their shadow root (a link, a text field), and those in a plain element around them, such as a
 * `<label>`. The items of a component that has its own, such as the radios of a radio group, aren't. The keys of a text the user edits stay
 * the text's, so a text field is best last.
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
