import type { AnchorElement } from "../anchor/anchor.js";
import type { DefaultAria } from "../utilities/aria.js";
import type { BreadcrumbItemContract } from "./breadcrumb-item.generated.js";

/**
 * An item of a breadcrumb (`role="listitem"`): a link to a page of the path, and a separator after it. The link wraps a native `<a>`, as a
 * link does (see `AnchorElement`), and is `aria-current="page"` for the current item.
 *
 * @remarks
 * Slots: the default slot for the link's content, between `start` and `end`, and `separator`.
 *
 * @public
 */
export interface BreadcrumbItemElement extends AnchorElement, BreadcrumbItemContract {}

/**
 * The default ARIA of a breadcrumb item: the `listitem` role.
 *
 * @public
 */
export function breadcrumbItemAria(): DefaultAria {
    return { role: "listitem" };
}
