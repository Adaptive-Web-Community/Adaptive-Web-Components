import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTreeView, treeViewTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Tree View template, {@link @microsoft/fast-foundation#treeViewTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTreeView> =
    (ds: DesignSystem) =>
        treeViewTemplate();
