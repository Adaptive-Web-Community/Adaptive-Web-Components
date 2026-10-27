import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { TabPanel } from "./tab-panel.js";

/**
 * @public
 */
export const TabPanelConditions = {
};

/**
 * @public
 */
export const TabPanelParts = {
};

/**
 * @public
 */
export const TabPanelAnatomy: ComponentAnatomy<typeof TabPanelConditions, typeof TabPanelParts> = {
    interactivity: Interactivity.never,
    conditions: TabPanelConditions,
    parts: TabPanelParts,
};

/**
 * Default Tab Panel template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TabPanel> =
    (ds: DesignSystem) => html<TabPanel>`
        <slot></slot>
    `;
