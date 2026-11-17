import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { treeViewDocumentation, treeViewWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { TreeView } from "./tree-view.js";

/**
 * @public
 */
export const TreeViewAnatomy = documentationToComponentAnatomy(treeViewDocumentation, treeViewWebBinding);

/**
 * Default Tree View template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TreeView> =
    (ds: DesignSystem) => html<TreeView>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
