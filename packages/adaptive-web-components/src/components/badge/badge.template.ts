import { ElementViewTemplate } from "@microsoft/fast-element";
import { badgeTemplate, FASTBadge } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const BadgeConditions = {};

/**
 * @public
 */
export const BadgeParts = {
    control: "control",
};

/**
 * @public
 */
export const BadgeAnatomy: ComponentAnatomy<typeof BadgeConditions, typeof BadgeParts> = {
    interactivity: Interactivity.never,
    conditions: BadgeConditions,
    parts: BadgeParts,
};

/**
 * Default Badge template, {@link @microsoft/fast-foundation#badgeTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBadge> =
    (ds: DesignSystem) =>
        badgeTemplate();
