import type { ValuesOf } from "../utilities/typings.js";

/**
 * Whether one item of an {@link AccordionElement} or several can be expanded at a time.
 *
 * @public
 */
export const AccordionExpandMode = {
    /**
     * One item is expanded at a time, and it can't be collapsed except by expanding another.
     */
    single: "single",

    /**
     * Any number of items can be expanded.
     */
    multi: "multi",
} as const;

/**
 * Whether one item of an {@link AccordionElement} or several can be expanded at a time.
 *
 * @public
 */
export type AccordionExpandMode = ValuesOf<typeof AccordionExpandMode>;

/**
 * An accordion: a list of {@link AccordionItemElement}s whose panels expand and collapse. Implements the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ | ARIA accordion pattern} with {@link AccordionController}.
 *
 * @remarks
 * Slots: the default slot for the items.
 *
 * Events: the `change` of an item bubbles through it.
 *
 * @public
 */
export interface AccordionElement extends HTMLElement {
    /**
     * Whether one item or several can be expanded at a time.
     *
     * @remarks
     * HTML attribute: `expand-mode`. The default is `multi`.
     */
    expandMode: AccordionExpandMode;
}
