/* eslint-disable */
// This file is generated from src/tooltip/tooltip.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Tooltip.
 *
 * @public
 */
export const TooltipSlots = {
    /** The tooltip text. */
    default: "",
} as const;

/**
 * Where it is shown next to its anchor.
 *
 * @public
 */
export const TooltipPlacement = {
    /** Above the anchor. */
    above: "above",

    /** Above the anchor, aligned to the start. */
    aboveStart: "aboveStart",

    /** Above the anchor, aligned to the end. */
    aboveEnd: "aboveEnd",

    /** Below the anchor. */
    below: "below",

    /** Below the anchor, aligned to the start. */
    belowStart: "belowStart",

    /** Below the anchor, aligned to the end. */
    belowEnd: "belowEnd",

    /** Before the anchor in the writing direction. */
    before: "before",

    /** Before the anchor, toward the block-start edge. */
    beforeTop: "beforeTop",

    /** Before the anchor, toward the block-end edge. */
    beforeBottom: "beforeBottom",

    /** After the anchor in the writing direction. */
    after: "after",

    /** After the anchor, toward the block-start edge. */
    afterTop: "afterTop",

    /** After the anchor, toward the block-end edge. */
    afterBottom: "afterBottom",
} as const;

/** @public */
export type TooltipPlacement = (typeof TooltipPlacement)[keyof typeof TooltipPlacement];

/**
 * A **Tooltip** is a short description of its anchor (`role="tooltip"`), shown as a manual popover in the top layer while the anchor is hovered or focused.
 *
 * @public
 */
export interface TooltipContract {
    /**
     * Whether the popover is shown.
     */
    open: boolean;

    /**
     * Where it is shown next to its anchor.
     */
    placement: TooltipPlacement;

    /**
     * Milliseconds the pointer stays on the anchor before show, and leaves before hide. Focus shows and hides at once.
     */
    delay: number;
}
