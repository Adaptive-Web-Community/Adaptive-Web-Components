import { ElementViewTemplate } from "@microsoft/fast-element";
import { avatarTemplate, FASTAvatar } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const AvatarConditions = {};

export const AvatarParts = {
    backplate: "backplate",
};

export const AvatarAnatomy: ComponentAnatomy<typeof AvatarConditions, typeof AvatarParts> = {
    interactivity: Interactivity.never,
    conditions: AvatarConditions,
    parts: AvatarParts,
};

/**
 * Default Avatar template, {@link @microsoft/fast-foundation#avatarTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAvatar> =
    (ds: DesignSystem) =>
        avatarTemplate();
