import { accordionItemComposition, type AccordionItemStatics } from "@adaptive-web/components-foundation";
import type { ComposeOptions, DesignSystem, ElementDefinition } from "../../design-system.js";
import { AccordionItem } from "./accordion-item.js";
import { template } from "./accordion-item.template.js";

/**
 * @public
 */
export function composeAccordionItem(ds: DesignSystem, options?: ComposeOptions<AccordionItem, AccordionItemStatics>): ElementDefinition<typeof AccordionItem> {
    return ds.compose(AccordionItem, accordionItemComposition, template, options);
}
