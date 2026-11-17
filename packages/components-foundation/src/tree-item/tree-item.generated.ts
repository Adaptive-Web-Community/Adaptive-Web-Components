/* eslint-disable */
// This file is generated from src/tree-item/tree-item.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Tree Item for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const TreeItemParts = {
    /** The row: expand button, optional `start` and `end`, and the label. */
    control: "control",

    /** Expands or collapses an item that has children; hidden when it has none. */
    expandCollapseButton: "expand-collapse-button",

    /** The default slot label. */
    content: "content",

    /** The child items (`role="group"`), hidden while collapsed. */
    items: "items",
} as const;

/**
 * Slot names of Tree Item.
 *
 * @public
 */
export const TreeItemSlots = {
    /** The item label. */
    default: "",

    /** Optional content before the label. */
    start: "start",

    /** Optional content after the label. */
    end: "end",

    /** Child tree items. */
    item: "item",

    /** Icon in the expand/collapse button. */
    expandCollapseIcon: "expandCollapseIcon",
} as const;

/**
 * A **Tree Item** is one node in a tree (`role="treeitem"`), which can have child items in a collapsible group.
 *
 * @public
 */
export interface TreeItemContract {
    /**
     * Whether its child items are shown.
     */
    expanded: boolean;

    /**
     * Whether it is selected.
     */
    selected: boolean;

    /**
     * Whether it is disabled: it stays focusable but can't be selected or toggled.
     */
    disabled: boolean;

    /**
     * Whether its tree has items with children, set by the tree so rows align.
     */
    nested: boolean;
}
