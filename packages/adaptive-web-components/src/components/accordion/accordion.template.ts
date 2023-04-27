import { ElementViewTemplate } from "@microsoft/fast-element";
import { accordionTemplate, FASTAccordion } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const AccordionConditions = {
};

export const AccordionParts = {
};

export const AccordionAnatomy: ComponentAnatomy<typeof AccordionConditions, typeof AccordionParts> = {
    interactivity: Interactivity.never,
    conditions: AccordionConditions,
    parts: AccordionParts,
};

/**
 * Default Accordion template, {@link @microsoft/fast-foundation#accordionTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAccordion> =
    (ds: DesignSystem) =>
        accordionTemplate();
