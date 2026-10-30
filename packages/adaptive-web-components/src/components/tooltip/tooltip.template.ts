import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Tooltip } from "./tooltip.js";

/**
 * @public
 */
export const TooltipConditions = {
    open: ":popover-open",
};

/**
 * @public
 */
export const TooltipParts = {
};

/**
 * @public
 */
export const TooltipAnatomy: ComponentAnatomy<typeof TooltipConditions, typeof TooltipParts> = {
    interactivity: Interactivity.never,
    conditions: TooltipConditions,
    parts: TooltipParts,
};

/**
 * Default Tooltip template. The element is the popover, in the top layer, placed next to its anchor by the template's styles.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Tooltip> =
    (ds: DesignSystem) => html<Tooltip>`
        <slot></slot>
    `;
