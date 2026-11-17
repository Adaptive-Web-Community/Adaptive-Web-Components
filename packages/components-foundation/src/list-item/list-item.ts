import type { DefaultAria } from "../utilities/aria.js";
import type { ListItemContract } from "./list-item.generated.js";

/**
 * An item of a {@link ListElement} (`role="listitem"`).
 *
 * @remarks
 * Slots: the default slot for its content.
 *
 * @public
 */
export interface ListItemElement extends HTMLElement, ListItemContract {}

/**
 * The default ARIA of a list item: the `listitem` role.
 *
 * @public
 */
export function listItemAria(): DefaultAria {
    return { role: "listitem" };
}
