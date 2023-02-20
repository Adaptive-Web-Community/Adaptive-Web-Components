import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import chevronUpIcon from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeAccordionItem } from "./accordion-item.compose.js";
import { AccordionItemIconKeys } from './accordion-item.template.js';

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
            [AccordionItemIconKeys.collapsed]: chevronDownIcon,
            [AccordionItemIconKeys.expanded]: chevronUpIcon
        }
    }
);