/* eslint-disable */
// This file is generated from src/divider/divider.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Divider.
 *
 * @public
 */
export const DividerSlots = {
    /** Optional content in the divider. */
    default: "",
} as const;

/**
 * The direction of the line.
 *
 * @public
 */
export const DividerOrientation = {
    /** A horizontal rule. */
    horizontal: "horizontal",

    /** A vertical rule. */
    vertical: "vertical",
} as const;

/** @public */
export type DividerOrientation = (typeof DividerOrientation)[keyof typeof DividerOrientation];

/**
 * A **Divider** is a line that separates content (`role="separator"`). Authors may set `role="presentation"` for decoration only.
 *
 * @public
 */
export interface DividerContract {
    /**
     * The direction of the line.
     */
    orientation: DividerOrientation;
}
