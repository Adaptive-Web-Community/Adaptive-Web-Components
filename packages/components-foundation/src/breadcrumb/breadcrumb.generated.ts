/* eslint-disable */
// This file is generated from src/breadcrumb/breadcrumb.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Breadcrumb for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const BreadcrumbParts = {
    /** The list of breadcrumb items. */
    list: "list",
} as const;

/**
 * Slot names of Breadcrumb.
 *
 * @public
 */
export const BreadcrumbSlots = {
    /** Breadcrumb items. */
    default: "",

    /** Optional content before the list. */
    start: "start",

    /** Optional content after the list. */
    end: "end",
} as const;

/**
 * A **Breadcrumb** is a navigation landmark (`role="navigation"`) with the path to the current page, which is the last item.
 *
 * @public
 */
export interface BreadcrumbContract {
}
