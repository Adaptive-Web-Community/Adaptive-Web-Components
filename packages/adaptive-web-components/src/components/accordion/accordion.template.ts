import { ElementViewTemplate } from "@microsoft/fast-element";
import { accordionTemplate, FASTAccordion } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const AccordionConditions = {
};

/**
 * @public
 */
export const AccordionParts = {
};

/**
 * @public
 */
export const AccordionAnatomy: ComponentAnatomy<typeof AccordionConditions, typeof AccordionParts> = {
    interactivity: Interactivity.never,
    conditions: AccordionConditions,
    parts: AccordionParts,
};

/**
 * Default Accordion template, {@link @microsoft/fast-foundation#accordionTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAccordion> =
    (ds: DesignSystem) =>
        accordionTemplate();
