import { ElementViewTemplate } from "@microsoft/fast-element";
import { accordionItemTemplate, FASTAccordionItem } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the accordion item collapsed icon.
 * 
 * @beta
 */
export const AccordionItemIconKeys = {
    collapsed: "accordion-item-collapsed-icon",
    expanded: "accordion-item-expanded-icon"
} as const;

export type AccordionItemIconKeys = ValuesOf<typeof AccordionItemIconKeys>;

/**
 * Default Accordion Item template, {@link @microsoft/fast-foundation#accordionItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAccordionItem> =
    (ds: DesignSystem) =>
        accordionItemTemplate({
            collapsedIcon: ds.statics.get(AccordionItemIconKeys.collapsed),
            expandedIcon: ds.statics.get(AccordionItemIconKeys.expanded),
        });
