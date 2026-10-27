import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Accordion } from "./accordion.js";

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
 * Default Accordion template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Accordion> =
    (ds: DesignSystem) => html<Accordion>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
