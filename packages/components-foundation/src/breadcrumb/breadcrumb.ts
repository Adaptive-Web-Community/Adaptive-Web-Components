import type { BreadcrumbItemElement } from "../breadcrumb-item/breadcrumb-item.js";
import type { DefaultAria } from "../utilities/aria.js";

/**
 * The parts of a {@link BreadcrumbElement}.
 *
 * @public
 */
export const BreadcrumbParts = {
    /** The list of the items (`role="list"`). */
    list: "list",
} as const;

/**
 * A breadcrumb: a navigation landmark (`role="navigation"`) with the list of the pages on the path to the current one, which is the last.
 * Implements the {@link https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ | ARIA breadcrumb pattern}.
 *
 * @remarks
 * The author names the landmark, with `aria-label` on the host. The template has the `role="list"` element (the `list` part) around the
 * default slot, and the breadcrumb tells its last item that it is the current page with {@link setBreadcrumbItems}.
 *
 * Slots: the default slot for the items, and `start` and `end` around the list.
 *
 * @public
 */
export type BreadcrumbElement = HTMLElement;

/**
 * The default ARIA of a breadcrumb: the `navigation` role.
 *
 * @public
 */
export function breadcrumbAria(): DefaultAria {
    return { role: "navigation" };
}

/**
 * The items of a breadcrumb changed: the last is the current page, and the others aren't.
 *
 * @public
 */
export function setBreadcrumbItems(items: readonly BreadcrumbItemElement[]): void {
    items.forEach((item, index) => {
        item.current = index === items.length - 1;
    });
}
