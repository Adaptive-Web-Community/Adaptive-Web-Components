import { ElementViewTemplate } from "@microsoft/fast-element";
import { dividerTemplate, FASTDivider } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui"; 
import { DesignSystem } from "../../design-system.js";

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
 * Default Divider template, {@link @microsoft/fast-foundation#dividerTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDivider> =
    (ds: DesignSystem) =>
        dividerTemplate();
