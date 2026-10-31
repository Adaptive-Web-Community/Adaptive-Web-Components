import type { FASTElementDefinition } from "@microsoft/fast-element";
import { accordionItemComposition, type AccordionItemStatics } from "@adaptive-web/components-foundation";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AccordionItem } from "./accordion-item.js";
import { template } from "./accordion-item.template.js";

/**
 * @public
 */
export function composeAccordionItem(
    ds: DesignSystem,
    options?: ComposeOptions<AccordionItem, AccordionItemStatics>
): Promise<FASTElementDefinition<typeof AccordionItem>> {
    return ds.compose(AccordionItem, accordionItemComposition, template, options);
}
