/* eslint-disable */
// This file is generated from src/toolbar/toolbar.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Toolbar for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const ToolbarParts = {
    /** The container of the toolbar items, laid out in `orientation`. */
    positioningRegion: "positioning-region",
} as const;

/**
 * Slot names of Toolbar.
 *
 * @public
 */
export const ToolbarSlots = {
    /** Optional label that names the toolbar. */
    label: "label",

    /** The toolbar items. */
    default: "",

    /** Optional items before the default slot items. */
    start: "start",

    /** Optional items after the default slot items. */
    end: "end",
} as const;

/**
 * The direction in which the items are laid out, and the arrow keys that move between them.
 *
 * @public
 */
export const ToolbarOrientation = {
    /** Items in a row. */
    horizontal: "horizontal",

    /** Items in a column. */
    vertical: "vertical",
} as const;

/** @public */
export type ToolbarOrientation = (typeof ToolbarOrientation)[keyof typeof ToolbarOrientation];

/**
 * A **Toolbar** groups controls (`role="toolbar"`). Arrow keys move focus between items; one item is in the tab order at a time.
 *
 * @public
 */
export interface ToolbarContract {
    /**
     * The direction in which the items are laid out, and the arrow keys that move between them.
     */
    orientation: ToolbarOrientation;
}
