import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { accordionDocumentation, accordionWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Accordion } from "./accordion.js";

/**
 * @public
 */
export const AccordionAnatomy = documentationToComponentAnatomy(accordionDocumentation, accordionWebBinding);

/**
 * Default Accordion template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Accordion> =
    (ds: DesignSystem) => html<Accordion>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
