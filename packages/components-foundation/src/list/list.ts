import type { DefaultAria } from "../utilities/aria.js";
import type { ListContract } from "./list.generated.js";

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
export interface ListElement extends HTMLElement, ListContract {}

/**
 * The default ARIA of a list: the `list` role.
 *
 * @public
 */
export function listAria(): DefaultAria {
    return { role: "list" };
}
