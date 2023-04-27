import { ElementViewTemplate } from "@microsoft/fast-element";
import { badgeTemplate, FASTBadge } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const BadgeConditions = {};

export const BadgeParts = {
    control: "control",
};

export const BadgeAnatomy: ComponentAnatomy<typeof BadgeConditions, typeof BadgeParts> = {
    interactivity: Interactivity.never,
    conditions: BadgeConditions,
    parts: BadgeParts,
};

/**
 * Default Badge template, {@link @microsoft/fast-foundation#badgeTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBadge> =
    (ds: DesignSystem) =>
        badgeTemplate();
