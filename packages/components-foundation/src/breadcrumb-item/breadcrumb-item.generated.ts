/* eslint-disable */
// This file is generated from src/breadcrumb-item/breadcrumb-item.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { AnchorContract } from "../anchor/anchor.generated.js";

/**
 * Part names of Breadcrumb Item for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const BreadcrumbItemParts = {
    /** The native `<a>`. */
    control: "control",

    /** The link label between optional `start` and `end` slots. */
    content: "content",

    /** The separator after the link, hidden for the current item. */
    separator: "separator",
} as const;

/**
 * Slot names of Breadcrumb Item.
 *
 * @public
 */
export const BreadcrumbItemSlots = {
    /** The content of the element, which is its label and names it. */
    default: "",

    /** Optional content before the label. */
    start: "start",

    /** Optional content after the label. */
    end: "end",

    /** Replaces the default separator after the link. */
    separator: "separator",
} as const;

/**
 * A **Breadcrumb Item** is a page on the path (`role="listitem"`): a link and a separator, with `aria-current="page"` on the last item.
 *
 * @public
 */
export interface BreadcrumbItemContract extends AnchorContract {
    /**
     * Whether it is the current page: the last item in its breadcrumb.
     */
    current: boolean;
}
