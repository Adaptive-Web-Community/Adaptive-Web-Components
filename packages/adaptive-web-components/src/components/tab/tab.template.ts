import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTab, tabTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const TabConditions = {
};

export const TabParts = {
};

export const TabAnatomy: ComponentAnatomy<typeof TabConditions, typeof TabParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TabConditions,
    parts: TabParts,
};

/**
 * Default Tab template, {@link @microsoft/fast-foundation#tabTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTab> =
    (ds: DesignSystem) =>
        tabTemplate();
