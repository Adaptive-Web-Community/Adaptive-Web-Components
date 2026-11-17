/* eslint-disable */
// This file is generated from src/tablist/tablist.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Tablist.
 *
 * @public
 */
export const TablistSlots = {
    /** The tabs. */
    default: "",
} as const;

/**
 * The direction of the tabs and the arrow keys that move between them.
 *
 * @public
 */
export const TablistOrientation = {
    /** Tabs in a row. */
    horizontal: "horizontal",

    /** Tabs in a column. */
    vertical: "vertical",
} as const;

/** @public */
export type TablistOrientation = (typeof TablistOrientation)[keyof typeof TablistOrientation];

/**
 * A **Tablist** groups tabs (`role="tablist"`). One tab is selected; its panel lives in a separate element referenced by `panels`.
 *
 * @public
 */
export interface TablistContract {
    /**
     * The direction of the tabs and the arrow keys that move between them.
     */
    orientation: TablistOrientation;
}
