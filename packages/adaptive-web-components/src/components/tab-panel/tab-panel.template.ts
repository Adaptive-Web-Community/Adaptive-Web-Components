import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTabPanel, tabPanelTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Tab Panel template, {@link @microsoft/fast-foundation#tabPanelTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTabPanel> =
    (ds: DesignSystem) =>
        tabPanelTemplate();
