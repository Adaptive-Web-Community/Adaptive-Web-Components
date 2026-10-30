import type { DefaultAria } from "../utilities/aria.js";

/**
 * The parts of a {@link TreeItemElement}.
 *
 * @public
 */
export const TreeItemParts = {
    /** The row of the item: its button, `start`, content, and `end`. */
    control: "control",

    /** The button that expands and collapses an item that has items, for the pointer: the arrows do it from the keyboard. */
    expandCollapseButton: "expand-collapse-button",

    /** The container of the default slot. */
    content: "content",

    /** The group of its items (`role="group"`), hidden while it is collapsed. */
    items: "items",
} as const;

/**
 * An item of a tree (`role="treeitem"`), which can have items of its own, shown when it is expanded. Implements the item of the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ | ARIA tree view pattern}.
 *
 * @remarks
 * The host is the item, and takes focus; its tree owns its `tabindex`. Its items are its child tree items, which it puts in its `item`
 * slot, in a `role="group"` element of its template. A disabled item stays focusable, as the ARIA practices ask of tree items, and can't be
 * selected, expanded, or collapsed.
 *
 * Slots: the default slot for its label, `start` and `end`, and `item`, for its items.
 *
 * Events: `change` when the user selects it, and `toggle` when the user expands or collapses it, which bubble.
 *
 * @public
 */
export interface TreeItemElement extends HTMLElement {
    /**
     * Whether its items are shown.
     *
     * @remarks
     * HTML attribute: `expanded`.
     */
    expanded: boolean;

    /**
     * Whether it is selected. One item of a tree is selected at a time.
     *
     * @remarks
     * HTML attribute: `selected`.
     */
    selected: boolean;

    /**
     * Whether it is disabled: it stays focusable, and can't be selected, expanded, or collapsed.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Its items: its child tree items.
     */
    readonly items: readonly TreeItemElement[];

    /**
     * Whether its tree has items that have items, given by the tree, so that the items without any line up with those that have a button.
     */
    nested: boolean;
}

/**
 * The slot of a {@link TreeItemElement} for its items.
 */
const itemSlot = "item";

/**
 * The default ARIA of a tree item: the `treeitem` role, whether it is selected and disabled, and, when it has items, whether it is expanded.
 *
 * @public
 */
export function treeItemAria(item: TreeItemElement): DefaultAria {
    return {
        role: "treeitem",
        ariaSelected: item.selected ? "true" : "false",
        ariaDisabled: item.disabled ? "true" : null,
        ariaExpanded: item.items.length > 0 ? `${item.expanded}` : null,
    };
}

/**
 * The items of a tree item changed: they are put in its `item` slot.
 *
 * @public
 */
export function placeTreeItems(items: readonly TreeItemElement[]): void {
    for (const item of items) {
        item.slot = itemSlot;
    }
}

/**
 * Expands or collapses a tree item as the user asked, and emits `toggle`.
 *
 * @remarks
 * Does nothing when the item is disabled or has no items. For the click of its button, and the keys of its tree.
 *
 * @public
 */
export function toggleTreeItem(item: TreeItemElement): void {
    if (item.disabled || item.items.length === 0) {
        return;
    }
    item.expanded = !item.expanded;
    item.dispatchEvent(new Event("toggle", { bubbles: true }));
}

/**
 * Selects a tree item as the user asked, and emits `change`.
 *
 * @remarks
 * Does nothing when the item is disabled or already selected. For the click of the item, and Enter.
 *
 * @public
 */
export function selectTreeItem(item: TreeItemElement): void {
    if (item.disabled || item.selected) {
        return;
    }
    item.selected = true;
    item.dispatchEvent(new Event("change", { bubbles: true }));
}
