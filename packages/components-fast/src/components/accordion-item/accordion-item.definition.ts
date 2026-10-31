import { chevronDownIcon, chevronUpIcon } from "@adaptive-web/components-foundation";
import type { ComponentDefinition } from "../../design-system.js";
import { composeAccordionItem } from "./accordion-item.compose.js";
import { AccordionItemStatics } from './accordion-item.template.js';
import { styleRules } from "./accordion-item.styles.rules.js";

/**
 * The Accordion Item custom element definition. Implements {@link AccordionItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion-item\>
 *
 * @public
 */
export const accordionItemDefinition: ComponentDefinition = ds => composeAccordionItem(
    ds,
    {
        statics: {
            [AccordionItemStatics.collapsed]: chevronDownIcon,
            [AccordionItemStatics.expanded]: chevronUpIcon,
        },
        styleRules,
    }
);
