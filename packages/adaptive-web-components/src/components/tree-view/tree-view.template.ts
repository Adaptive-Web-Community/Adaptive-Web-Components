import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTreeView, treeViewTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const TreeViewConditions = {
};

/**
 * @public
 */
export const TreeViewParts = {
};

/**
 * @public
 */
export const TreeViewAnatomy: ComponentAnatomy<typeof TreeViewConditions, typeof TreeViewParts> = {
    interactivity: Interactivity.never,
    conditions: TreeViewConditions,
    parts: TreeViewParts,
};

/**
 * Default Tree View template, {@link @microsoft/fast-foundation#treeViewTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTreeView> =
    (ds: DesignSystem) =>
        treeViewTemplate();
