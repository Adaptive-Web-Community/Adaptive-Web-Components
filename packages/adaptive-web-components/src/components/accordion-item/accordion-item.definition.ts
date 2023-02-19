import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import chevronUpIcon from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeAccordionItem } from "./accordion-item.compose.js";
import { AccordionItemCollapsedIconKey, AccordionItemExpandedIconKey } from "./accordion-item.template.js";

if (!DefaultDesignSystem.statics.has(AccordionItemCollapsedIconKey)) {
    DefaultDesignSystem.statics.set(AccordionItemCollapsedIconKey, await fetch(chevronDownIcon).then(x => x.text()))
}
if (!DefaultDesignSystem.statics.has(AccordionItemExpandedIconKey)) {
    DefaultDesignSystem.statics.set(AccordionItemExpandedIconKey, await fetch(chevronUpIcon).then(x => x.text()))
}

/**
 * The Accordion Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordionItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion-item\>
 *
 * @public
 */
export const accordionItemDefinition = composeAccordionItem(DefaultDesignSystem);