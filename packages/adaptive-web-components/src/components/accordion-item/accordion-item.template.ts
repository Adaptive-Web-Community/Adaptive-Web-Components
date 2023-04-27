import { ElementViewTemplate } from "@microsoft/fast-element";
import { accordionItemTemplate, FASTAccordionItem } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the accordion item collapsed icon.
 * 
 * @beta
 */
export const AccordionItemStatics = {
    collapsed: "accordion-item-collapsed-icon",
    expanded: "accordion-item-expanded-icon"
} as const;

export type AccordionItemStatics = ValuesOf<typeof AccordionItemStatics>;

export const AccordionItemConditions = {
    expanded: "[expanded]",
};

export const AccordionItemParts = {
    heading: "heading",
    button: "button",
    headingContent: "heading-content",
    icon: "icon",
    region: "region",
};

export const AccordionItemAnatomy: ComponentAnatomy<typeof AccordionItemConditions, typeof AccordionItemParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: AccordionItemConditions,
    parts: AccordionItemParts,
};

/**
 * Default Accordion Item template, {@link @microsoft/fast-foundation#accordionItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAccordionItem> =
    (ds: DesignSystem) =>
        accordionItemTemplate({
            collapsedIcon: ds.statics.get(AccordionItemStatics.collapsed),
            expandedIcon: ds.statics.get(AccordionItemStatics.expanded),
        });
