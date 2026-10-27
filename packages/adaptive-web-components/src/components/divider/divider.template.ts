import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Divider } from "./divider.js";

/**
 * @public
 */
export const DividerConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
};

/**
 * @public
 */
export const DividerParts = {
};

/**
 * @public
 */
export const DividerAnatomy: ComponentAnatomy<typeof DividerConditions, typeof DividerParts> = {
    interactivity: Interactivity.never,
    conditions: DividerConditions,
    parts: DividerParts,
};

/**
 * Default Divider template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Divider> =
    (ds: DesignSystem) => html<Divider>`
        <slot></slot>
    `;
