import { html, type TemplateResult } from "lit";
import { accordionDocumentation, accordionWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import type { DesignSystem } from "../../design-system.js";
import type { Accordion } from "./accordion.js";

/**
 * @public
 */
export const AccordionAnatomy = documentationToComponentAnatomy(accordionDocumentation, accordionWebBinding);

/**
 * Default Accordion template.
 * @public
 */
export const template: (ds: DesignSystem) => (x: Accordion) => TemplateResult =
    (ds: DesignSystem) => (x: Accordion) => html`
        <slot></slot>
    `;