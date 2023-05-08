import { ElementViewTemplate } from "@microsoft/fast-element";
import { avatarTemplate, FASTAvatar } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const AvatarConditions = {};

/**
 * @public
 */
export const AvatarParts = {
    backplate: "backplate",
};

/**
 * @public
 */
export const AvatarAnatomy: ComponentAnatomy<typeof AvatarConditions, typeof AvatarParts> = {
    interactivity: Interactivity.never,
    conditions: AvatarConditions,
    parts: AvatarParts,
};

/**
 * Default Avatar template, {@link @microsoft/fast-foundation#avatarTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAvatar> =
    (ds: DesignSystem) =>
        avatarTemplate();
