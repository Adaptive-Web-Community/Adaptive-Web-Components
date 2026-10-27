/**
 * A tree view (`role="tree"`) of tree items, which can have items of their own: a hierarchy that the user expands and collapses, and of
 * which one item is selected. Implements the {@link https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ | ARIA tree view pattern} with
 * {@link TreeViewController}.
 *
 * @remarks
 * One item is in the tab order: the selected one, or the first. Up and Down move the focus between the items that are shown, Right expands
 * an item or moves to its first item, Left collapses it or moves to its parent, and Enter and a click select it.
 *
 * Slots: the default slot for the items.
 *
 * Events: the `change` and `toggle` of an item bubble through it.
 *
 * @public
 */
export type TreeViewElement = HTMLElement;
