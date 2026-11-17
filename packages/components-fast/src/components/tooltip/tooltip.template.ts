import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { tooltipDocumentation, tooltipWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Tooltip } from "./tooltip.js";

/**
 * @public
 */
export const TooltipAnatomy = documentationToComponentAnatomy(tooltipDocumentation, tooltipWebBinding);

/**
 * Default Tooltip template. The element is the popover, in the top layer, placed next to its anchor by the template's styles.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Tooltip> =
    (ds: DesignSystem) => html<Tooltip>`
        <slot></slot>
    `;
