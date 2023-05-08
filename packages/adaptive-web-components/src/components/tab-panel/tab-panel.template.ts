import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTabPanel, tabPanelTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

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
 * Default Tab Panel template, {@link @microsoft/fast-foundation#tabPanelTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTabPanel> =
    (ds: DesignSystem) =>
        tabPanelTemplate();
