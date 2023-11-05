import { accordionTemplate } from "@microsoft/fast-foundation";
import { type ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";

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
export {
    accordionTemplate
};
