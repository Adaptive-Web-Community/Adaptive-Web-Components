import { children, elements, type ElementViewTemplate, html } from "@microsoft/fast-element";
import { TreeItemParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { TreeItem } from "./tree-item.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the tree item.
 *
 * @public
 */
export const TreeItemStatics = {
    expandCollapse: "tree-item-expand-collapse-icon"
} as const;

/**
 * @public
 */
export type TreeItemStatics = ValuesOf<typeof TreeItemStatics>;

/**
 * @public
 */
export const TreeItemConditions = {
    selected: "[selected]",
    expanded: "[expanded]",
};

export { TreeItemParts };

/**
 * @public
 */
export const TreeItemAnatomy: ComponentAnatomy<typeof TreeItemConditions, typeof TreeItemParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TreeItemConditions,
    parts: TreeItemParts,
    focus: Focus.contextChildFocused("control"),
};

/**
 * Default Tree Item template: the row, with the button that expands and collapses it when it has items, and the group of its items.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TreeItem> =
    (ds: DesignSystem) => html<TreeItem>`
        <template ${children({ property: "childElements", filter: elements() })}>
            <div class="control" part="control">
                <span
                    class="expand-collapse-button"
                    part="expand-collapse-button"
                    aria-hidden="true"
                    ?hidden="${x => x.items.length === 0}"
                    @click="${x => x.handleExpandCollapseClick()}"
                >
                    <slot name="expand-collapse-icon">${staticallyCompose(ds.statics.get(TreeItemStatics.expandCollapse))}</slot>
                </span>
                <slot name="start"></slot>
                <span class="content" part="content">
                    <slot></slot>
                </span>
                <slot name="end"></slot>
            </div>
            <div class="items" part="items" role="group" ?hidden="${x => !x.expanded || x.items.length === 0}">
                <slot name="item"></slot>
            </div>
        </template>
    `;
