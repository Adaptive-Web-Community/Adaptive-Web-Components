import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg?raw";
import chevronUpIcon from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg?raw";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeAccordionItem } from "./accordion-item.compose.js";
import { AccordionItemCollapsedIconKey, AccordionItemExpandedIconKey } from "./accordion-item.template.js";

if (!DefaultDesignSystem.statics.has(AccordionItemCollapsedIconKey)) {
    DefaultDesignSystem.statics.set(AccordionItemCollapsedIconKey, chevronDownIcon)
}
if (!DefaultDesignSystem.statics.has(AccordionItemExpandedIconKey)) {
    DefaultDesignSystem.statics.set(AccordionItemExpandedIconKey, chevronUpIcon)
}

/**
 * The Accordion Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordionItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion-item\>
 *
 * @public
 */
export const AdaptiveAccordionItem = composeAccordionItem(DefaultDesignSystem);