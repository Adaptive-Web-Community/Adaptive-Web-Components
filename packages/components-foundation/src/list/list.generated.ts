/* eslint-disable */
// This file is generated from src/list/list.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of List.
 *
 * @public
 */
export const ListSlots = {
    /** List items. */
    default: "",
} as const;

/**
 * Layout direction only; a list has no `aria-orientation`.
 *
 * @public
 */
export const ListOrientation = {
    /** Items in a row. */
    horizontal: "horizontal",

    /** Items in a column. */
    vertical: "vertical",
} as const;

/** @public */
export type ListOrientation = (typeof ListOrientation)[keyof typeof ListOrientation];

/**
 * A **List** is a static group of items (`role="list"`). Keyboard focus reaches items through their own controls, not arrow-key roving.
 *
 * @public
 */
export interface ListContract {
    /**
     * Layout direction only; a list has no `aria-orientation`.
     */
    orientation: ListOrientation;
}
