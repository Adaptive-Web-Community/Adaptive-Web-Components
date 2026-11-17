/* eslint-disable */
// This file is generated from src/tab/tab.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Tab for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const TabParts = {
    /** The default slot label between optional `start` and `end` slots. */
    content: "content",
} as const;

/**
 * Slot names of Tab.
 *
 * @public
 */
export const TabSlots = {
    /** The tab label. */
    default: "",

    /** Optional content before the label. */
    start: "start",

    /** Optional content after the label. */
    end: "end",
} as const;

/**
 * A **Tab** is one label in a tablist (`role="tab"`). When selected, its paired tab panel is shown.
 *
 * @public
 */
export interface TabContract {
    /**
     * Whether it is selected and its panel is shown.
     */
    selected: boolean;

    /**
     * Whether it is disabled: it stays focusable, as ARIA practices ask of tabs, and can't be selected.
     */
    disabled: boolean;
}
