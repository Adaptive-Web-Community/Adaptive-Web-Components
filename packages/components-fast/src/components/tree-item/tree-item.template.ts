import { children, elements, type ElementViewTemplate, html } from "@microsoft/fast-element";
import { treeItemDocumentation, TreeItemParts, TreeItemSlots, treeItemWebBinding, type ValuesOf } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
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
export const TreeItemAnatomy = documentationToComponentAnatomy(treeItemDocumentation, treeItemWebBinding);

/**
 * Default Tree Item template: the row, with the button that expands and collapses it when it has items, and the group of its items.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<TreeItem> =
    (ds: DesignSystem) => html<TreeItem>`
        <template ${children({ property: "childElements", filter: elements() })}>
            <div class=${(_) => TreeItemParts.control} part=${(_) => TreeItemParts.control}>
                <span
                    class=${(_) => TreeItemParts.expandCollapseButton}
                    part=${(_) => TreeItemParts.expandCollapseButton}
                    aria-hidden="true"
                    ?hidden="${x => x.items.length === 0}"
                    @click="${x => x.handleExpandCollapseClick()}"
                >
                    <slot name=${(_) => TreeItemSlots.expandCollapseIcon}>${staticallyCompose(ds.statics.get(TreeItemStatics.expandCollapse))}</slot>
                </span>
                <slot name=${(_) => TreeItemSlots.start}></slot>
                <span class=${(_) => TreeItemParts.content} part=${(_) => TreeItemParts.content}>
                    <slot></slot>
                </span>
                <slot name=${(_) => TreeItemSlots.end}></slot>
            </div>
            <div class=${(_) => TreeItemParts.items} part=${(_) => TreeItemParts.items} role="group" ?hidden="${x => !x.expanded || x.items.length === 0}">
                <slot name=${(_) => TreeItemSlots.item}></slot>
            </div>
        </template>
    `;
