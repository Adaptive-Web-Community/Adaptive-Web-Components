import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTabs, tabsTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Tabs template, {@link @microsoft/fast-foundation#tabsTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTabs> =
    (ds: DesignSystem) =>
        tabsTemplate();
