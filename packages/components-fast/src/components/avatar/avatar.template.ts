import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { avatarDocumentation, AvatarParts, AvatarSlots, avatarWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Avatar } from "./avatar.js";

/**
 * @public
 */
export const AvatarAnatomy = documentationToComponentAnatomy(avatarDocumentation, avatarWebBinding);

/**
 * Default Avatar template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Avatar> =
    (ds: DesignSystem) => html<Avatar>`
        <div class=${(_) => AvatarParts.backplate} part=${(_) => AvatarParts.backplate}>
            <slot name=${(_) => AvatarSlots.media}></slot>
            <slot></slot>
        </div>
        <slot name=${(_) => AvatarSlots.badge}></slot>
    `;
