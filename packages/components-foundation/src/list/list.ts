import type { DefaultAria } from "../utilities/aria.js";
import type { Orientation } from "../utilities/orientation.js";

/**
 * A list (`role="list"`) of {@link ListItemElement}s, laid out in a row or a column.
 *
 * @remarks
 * It is static: the keyboard reaches its items by their own content, in the tab order, and doesn't move between them with the arrows (a
 * list that does is a listbox, a toolbar, or a grid). In a row, its overflow scrolls; how it scrolls (scroll snapping) is the styles'.
 *
 * Slots: the default slot for the items.
 *
 * @public
 */
export interface ListElement extends HTMLElement {
    /**
     * The direction in which the items are laid out. It is the layout only: a list has no `aria-orientation`.
     *
     * @remarks
     * HTML attribute: `orientation`. The default is `vertical`.
     */
    orientation: Orientation;
}

/**
 * The default ARIA of a list: the `list` role.
 *
 * @public
 */
export function listAria(): DefaultAria {
    return { role: "list" };
}
