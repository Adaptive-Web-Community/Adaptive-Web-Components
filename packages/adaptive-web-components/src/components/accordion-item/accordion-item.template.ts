import { accordionItemTemplate } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { type ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";

/**
 * Keys for {@link DesignSystem} `statics` registration for the accordion item collapsed icon.
 * 
 * @beta
 */
export const AccordionItemStatics = {
    collapsed: "accordion-item-collapsed-icon",
    expanded: "accordion-item-expanded-icon"
} as const;

/**
 * @beta
 */
export type AccordionItemStatics = ValuesOf<typeof AccordionItemStatics>;

/**
 * @public
 */
export const AccordionItemConditions = {
    expanded: "[expanded]",
};

/**
 * @public
 */
export const AccordionItemParts = {
    heading: "heading",
    button: "button",
    headingContent: "heading-content",
    icon: "icon",
    region: "region",
};

/**
 * @public
 */
export const AccordionItemAnatomy: ComponentAnatomy<typeof AccordionItemConditions, typeof AccordionItemParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: AccordionItemConditions,
    parts: AccordionItemParts,
};

/**
 * Default Accordion Item template, {@link @microsoft/fast-foundation#accordionItemTemplate}.
 * @public
 */
export {
    accordionItemTemplate
};
