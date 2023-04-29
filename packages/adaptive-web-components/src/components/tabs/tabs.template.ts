import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTabs, tabsTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const TabsConditions = {
    horizontal: "[orientation='horizontal']",
    vertical: "[orientation='vertical']",
};

export const TabsParts = {
    tablist: "tablist",
    tabpanel: "tabpanel",
};

export const TabsAnatomy: ComponentAnatomy<typeof TabsConditions, typeof TabsParts> = {
    interactivity: Interactivity.never,
    conditions: TabsConditions,
    parts: TabsParts,
};

/**
 * Default Tabs template, {@link @microsoft/fast-foundation#tabsTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTabs> =
    (ds: DesignSystem) =>
        tabsTemplate();
