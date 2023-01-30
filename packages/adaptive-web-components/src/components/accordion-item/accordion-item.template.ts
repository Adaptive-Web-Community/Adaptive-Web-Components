import { ElementViewTemplate } from "@microsoft/fast-element";
import { accordionItemTemplate, FASTAccordionItem } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the accordion item collapsed icon.
 */
export const AccordionItemCollapsedIconKey: string = "accordion-item-collapsed-icon";

/**
 * Key for {@link DesignSystem} `statics` registration for the accordion item expanded icon.
 */
export const AccordionItemExpandedIconKey: string = "accordion-item-expanded-icon";

/**
 * Default Accordion Item template, {@link @microsoft/fast-foundation#accordionItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAccordionItem> =
    (ds: DesignSystem) =>
        accordionItemTemplate({
            collapsedIcon: ds.statics.get(AccordionItemCollapsedIconKey),
            expandedIcon: ds.statics.get(AccordionItemExpandedIconKey),
        });
