import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { TreeView } from "./tree-view.js";

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
 * Default Tree View template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TreeView> =
    (ds: DesignSystem) => html<TreeView>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
