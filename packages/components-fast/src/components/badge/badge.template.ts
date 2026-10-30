import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { BadgeParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Badge } from "./badge.js";

/**
 * @public
 */
export const BadgeConditions = {};

export { BadgeParts };

/**
 * @public
 */
export const BadgeAnatomy: ComponentAnatomy<typeof BadgeConditions, typeof BadgeParts> = {
    interactivity: Interactivity.never,
    conditions: BadgeConditions,
    parts: BadgeParts,
};

/**
 * Default Badge template. The host is the badge's box, and the template is its content.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Badge> =
    (ds: DesignSystem) => html<Badge>`
        <slot name="start"></slot>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <slot name="end"></slot>
    `;
