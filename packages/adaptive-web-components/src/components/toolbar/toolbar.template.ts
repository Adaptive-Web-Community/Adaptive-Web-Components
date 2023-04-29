import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTToolbar, toolbarTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const ToolbarConditions = {
    horizontal: "[orientation='horizontal']",
    vertical: "[orientation='vertical']",
};

export const ToolbarParts = {
    positioningRegion: "positioning-region",
};

export const ToolbarAnatomy: ComponentAnatomy<typeof ToolbarConditions, typeof ToolbarParts> = {
    interactivity: Interactivity.never,
    conditions: ToolbarConditions,
    parts: ToolbarParts,
};

/**
 * Default Toolbar template, {@link @microsoft/fast-foundation#toolbarTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTToolbar> =
    (ds: DesignSystem) =>
        toolbarTemplate();
