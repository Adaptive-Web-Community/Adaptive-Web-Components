import type { AccordionItemContract } from "./accordion-item.generated.js";

/**
 * The levels of a heading, as `aria-level` has them.
 *
 * @public
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

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
export interface AccordionItemElement extends HTMLElement, AccordionItemContract {}

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
