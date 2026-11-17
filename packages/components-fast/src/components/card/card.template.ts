import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { cardDocumentation, cardWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Card } from "./card.js";

/**
 * @public
 */
export const CardAnatomy = documentationToComponentAnatomy(cardDocumentation, cardWebBinding);

/**
 * Default Card template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Card> =
    (ds: DesignSystem) => html<Card>`
        <slot></slot>
    `;
