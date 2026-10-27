/**
 * The levels of a heading, as `aria-level` has them.
 *
 * @public
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The parts of an {@link AccordionItemElement}.
 *
 * @public
 */
export const AccordionItemParts = {
    /** The heading, with the button, the start and end slots, and the icon. */
    heading: "heading",

    /** The button that expands and collapses the item. */
    button: "button",

    /** The content of the button, from the `heading` slot. */
    headingContent: "heading-content",

    /** The expanded and collapsed icons. */
    icon: "icon",

    /** The panel of content, the region that the button controls. */
    panel: "panel",
} as const;

/**
 * An item of an accordion: a heading whose button expands and collapses a panel of content. Implements the heading and panel of the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ | ARIA accordion pattern}.
 *
 * @remarks
 * The template of an item has a `role="heading"` element at {@link AccordionItemElement.headingLevel}, with a native button that has
 * `aria-expanded` and `aria-controls`, and a `role="region"` panel labelled by the button and hidden when the item is collapsed. The button is
 * `aria-disabled` when the item is expanded and isn't {@link AccordionItemElement.collapsible}. Clicking the button calls
 * {@link toggleAccordionItem}, and focusing the item focuses the button.
 *
 * Slots: `heading` for the content of the button, the default slot for the panel, `start` and `end` after the button, and `collapsed-icon` and
 * `expanded-icon`.
 *
 * Events: `change`, which bubbles, when the user expands or collapses the item.
 *
 * @public
 */
export interface AccordionItemElement extends HTMLElement {
    /**
     * The level of the heading.
     *
     * @remarks
     * HTML attribute: `heading-level`. The default is 2.
     */
    headingLevel: HeadingLevel;

    /**
     * Whether the panel is shown.
     *
     * @remarks
     * HTML attribute: `expanded`.
     */
    expanded: boolean;

    /**
     * Whether the user can't expand or collapse the item.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether the user can collapse the item when it is expanded.
     *
     * @remarks
     * The accordion sets it to `false` for the expanded item when only one can be expanded. The default is `true`.
     */
    collapsible: boolean;
}

/**
 * Expands or collapses an accordion item as the user asked, and emits `change`.
 *
 * @remarks
 * Does nothing when the item is disabled, or is expanded and isn't collapsible. For the click of the item's button.
 *
 * @public
 */
export function toggleAccordionItem(item: AccordionItemElement): void {
    if (item.disabled || (item.expanded && !item.collapsible)) {
        return;
    }

    item.expanded = !item.expanded;
    item.dispatchEvent(new Event("change", { bubbles: true }));
}
