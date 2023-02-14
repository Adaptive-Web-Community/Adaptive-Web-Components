import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import chevronUpIcon from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./accordion-item.definition.js";
import { AccordionItemCollapsedIconKey, AccordionItemExpandedIconKey } from "./accordion-item.template.js";

if (!DefaultDesignSystem.statics.has(AccordionItemCollapsedIconKey)) {
    DefaultDesignSystem.statics.set(AccordionItemCollapsedIconKey, chevronDownIcon)
}
if (!DefaultDesignSystem.statics.has(AccordionItemExpandedIconKey)) {
    DefaultDesignSystem.statics.set(AccordionItemExpandedIconKey, chevronUpIcon)
}

definition().define();
