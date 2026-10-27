import { AnchorParts } from "../anchor/anchor.js";
import type { AnchorElement } from "../anchor/anchor.js";
import type { DefaultAria } from "../utilities/aria.js";

/**
 * The parts of a {@link BreadcrumbItemElement}: those of a link, and its separator.
 *
 * @public
 */
export const BreadcrumbItemParts = {
    ...AnchorParts,

    /** The separator after the link, hidden from assistive technology, and hidden for the current item. */
    separator: "separator",
} as const;

/**
 * An item of a breadcrumb (`role="listitem"`): a link to a page of the path, and a separator after it. The link wraps a native `<a>`, as a
 * link does (see `AnchorElement`), and is `aria-current="page"` for the current item.
 *
 * @remarks
 * Slots: the default slot for the link's content, between `start` and `end`, and `separator`.
 *
 * @public
 */
export interface BreadcrumbItemElement extends AnchorElement {
    /**
     * Whether it is the current page, given by its breadcrumb: its last item. Its link is `aria-current="page"`, and its separator is hidden.
     */
    current: boolean;
}

/**
 * The default ARIA of a breadcrumb item: the `listitem` role.
 *
 * @public
 */
export function breadcrumbItemAria(): DefaultAria {
    return { role: "listitem" };
}
