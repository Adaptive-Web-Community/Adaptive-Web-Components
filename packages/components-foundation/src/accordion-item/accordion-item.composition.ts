import type { ComponentComposition } from "../design-system/composition.js";
import { componentBaseStyles, svgIconStyles } from "../styles/styles.js";
import { AccordionItemStatics } from "./accordion-item.js";
import { accordionItemAestheticStyles, AccordionItemAnatomy, accordionItemTemplateStyles } from "./accordion-item.styles.js";

/**
 * What a design system composes an {@link AccordionItemElement} from.
 *
 * @public
 */
export const accordionItemComposition: ComponentComposition<AccordionItemStatics> = {
    name: "accordion-item",
    styles: [componentBaseStyles, accordionItemTemplateStyles, svgIconStyles, accordionItemAestheticStyles],
    anatomy: AccordionItemAnatomy,
    statics: [AccordionItemStatics.collapsed, AccordionItemStatics.expanded],
};
