import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTooltip, tooltipTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const TooltipConditions = {
    show: "[show='true']",
    visible: "[visible]",
};

export const TooltipParts = {
};

export const TooltipAnatomy: ComponentAnatomy<typeof TooltipConditions, typeof TooltipParts> = {
    interactivity: Interactivity.never,
    conditions: TooltipConditions,
    parts: TooltipParts,
};

/**
 * Default Tooltip template, {@link @microsoft/fast-foundation#tooltipTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTooltip> =
    (ds: DesignSystem) =>
        tooltipTemplate();
