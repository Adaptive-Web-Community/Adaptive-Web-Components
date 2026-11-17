import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { badgeDocumentation, BadgeParts, BadgeSlots, badgeWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Badge } from "./badge.js";

/**
 * @public
 */
export const BadgeAnatomy = documentationToComponentAnatomy(badgeDocumentation, badgeWebBinding);

/**
 * Default Badge template. The host is the badge's box, and the template is its content.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Badge> =
    (ds: DesignSystem) => html<Badge>`
        <slot name=${(_) => BadgeSlots.start}></slot>
        <span class=${(_) => BadgeParts.content} part=${(_) => BadgeParts.content}>
            <slot></slot>
        </span>
        <slot name=${(_) => BadgeSlots.end}></slot>
    `;
