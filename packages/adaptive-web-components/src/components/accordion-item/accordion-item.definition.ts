import { chevronDownIcon, chevronUpIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeAccordionItem } from "./accordion-item.compose.js";
import { AccordionItemStatics } from './accordion-item.template.js';
import { styleModules } from "./accordion-item.styles.modules.js";

/**
 * The Accordion Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordionItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion-item\>
 *
 * @public
 */
export const accordionItemDefinition = composeAccordionItem(
    DefaultDesignSystem,
    {
        statics: {
            [AccordionItemStatics.collapsed]: chevronDownIcon,
            [AccordionItemStatics.expanded]: chevronUpIcon,
        },
        styleModules,
    }
);
