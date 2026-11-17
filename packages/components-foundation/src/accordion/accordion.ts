import type { AccordionContract } from "./accordion.generated.js";

export { AccordionExpandMode } from "./accordion.generated.js";

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
export interface AccordionElement extends HTMLElement, AccordionContract {}
