/* eslint-disable */
// This file is generated from src/accordion-item/accordion-item.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Accordion Item for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const AccordionItemParts = {
    /** The heading row with the button, slots, and icon. */
    heading: "heading",

    /** The native button that expands and collapses the panel. */
    button: "button",

    /** Content from the `heading` slot inside the button. */
    headingContent: "heading-content",

    /** Collapsed and expanded icons. */
    icon: "icon",

    /** The region controlled by the button, hidden when collapsed. */
    panel: "panel",
} as const;

/**
 * Slot names of Accordion Item.
 *
 * @public
 */
export const AccordionItemSlots = {
    /** Label content inside the expand button. */
    heading: "heading",

    /** Panel content. */
    default: "",

    /** Optional content after the button in the heading row. */
    start: "start",

    /** Optional content after `start` in the heading row. */
    end: "end",

    /** Replaces the default collapsed icon. */
    collapsedIcon: "collapsed-icon",

    /** Replaces the default expanded icon. */
    expandedIcon: "expanded-icon",
} as const;

/**
 * An **Accordion Item** is a heading with a button that expands and collapses a content panel.
 *
 * @public
 */
export interface AccordionItemContract {
    /**
     * The level of the heading (`aria-level`). The default is 2.
     */
    headingLevel: number;

    /**
     * Whether the panel is shown.
     */
    expanded: boolean;

    /**
     * Whether the item can't be expanded or collapsed.
     */
    disabled: boolean;

    /**
     * Whether the user can collapse the item when it is expanded. The accordion may set this to `false` in single-expand mode.
     */
    collapsible: boolean;
}
