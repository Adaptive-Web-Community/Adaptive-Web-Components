import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { tabPanelDocumentation, tabPanelWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { TabPanel } from "./tab-panel.js";

/**
 * @public
 */
export const TabPanelAnatomy = documentationToComponentAnatomy(tabPanelDocumentation, tabPanelWebBinding);

/**
 * Default Tab Panel template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TabPanel> =
    (ds: DesignSystem) => html<TabPanel>`
        <slot></slot>
    `;
