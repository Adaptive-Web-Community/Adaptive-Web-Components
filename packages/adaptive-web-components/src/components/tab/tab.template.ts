import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTab, tabTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const TabConditions = {
};

/**
 * @public
 */
export const TabParts = {
};

/**
 * @public
 */
export const TabAnatomy: ComponentAnatomy<typeof TabConditions, typeof TabParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TabConditions,
    parts: TabParts,
};

/**
 * Default Tab template, {@link @microsoft/fast-foundation#tabTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTab> =
    (ds: DesignSystem) =>
        tabTemplate();
