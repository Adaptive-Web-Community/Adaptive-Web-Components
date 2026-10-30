import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Card } from "./card.js";

/**
 * @public
 */
export const CardConditions = {
};

/**
 * @public
 */
export const CardParts = {
};

/**
 * @public
 */
export const CardAnatomy: ComponentAnatomy<typeof CardConditions, typeof CardParts> = {
    interactivity: Interactivity.never,
    conditions: CardConditions,
    parts: CardParts,
};

/**
 * Default Card template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Card> =
    (ds: DesignSystem) => html<Card>`
        <slot></slot>
    `;
