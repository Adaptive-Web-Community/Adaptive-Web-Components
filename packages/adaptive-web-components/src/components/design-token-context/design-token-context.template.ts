import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { DesignTokenContext } from "./design-token-context.js";

/**
 * @public
 */
export const DesignTokenContextConditions = {
};

/**
 * @public
 */
export const DesignTokenContextParts = {
};

/**
 * @public
 */
export const DesignTokenContextAnatomy: ComponentAnatomy<typeof DesignTokenContextConditions, typeof DesignTokenContextParts> = {
    interactivity: Interactivity.never,
    conditions: DesignTokenContextConditions,
    parts: DesignTokenContextParts,
};

/**
 * Default DesignTokenContext template, {@link @microsoft/fast-foundation#DesignTokenContextTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<DesignTokenContext> =
    (ds: DesignSystem) =>
        html<DesignTokenContext>`
            <slot></slot>
        `;
