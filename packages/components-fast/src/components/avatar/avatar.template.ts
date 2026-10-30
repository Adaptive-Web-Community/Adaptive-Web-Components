import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { AvatarParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Avatar } from "./avatar.js";

/**
 * @public
 */
export const AvatarConditions = {};

export { AvatarParts };

/**
 * @public
 */
export const AvatarAnatomy: ComponentAnatomy<typeof AvatarConditions, typeof AvatarParts> = {
    interactivity: Interactivity.never,
    conditions: AvatarConditions,
    parts: AvatarParts,
};

/**
 * Default Avatar template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Avatar> =
    (ds: DesignSystem) => html<Avatar>`
        <div class="backplate" part="backplate">
            <slot name="media"></slot>
            <slot></slot>
        </div>
        <slot name="badge"></slot>
    `;
