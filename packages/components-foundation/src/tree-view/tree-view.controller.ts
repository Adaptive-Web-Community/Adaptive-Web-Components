import { selectTreeItem, toggleTreeItem, type TreeItemElement } from "../tree-item/tree-item.js";
import { RovingFocusController } from "../utilities/roving-focus.controller.js";
import type { TreeViewElement } from "./tree-view.js";

/**
 * What a {@link TreeViewController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type TreeViewInternals = Pick<ElementInternals, "role">;

/**
 * The options of a {@link TreeViewController}.
 *
 * @public
 */
export type TreeViewOptions = {
    /**
     * Whether an element is a tree item, which a binding knows by its class.
     */
    isItem: (element: Element) => element is TreeItemElement;
};

/**
 * The behavior of a {@link TreeViewElement}: the `tree` role; one item selected; the keys of the tree view pattern, with the items that are
 * shown in a {@link RovingFocusController} (without wrapping, disabled ones too); a click, which selects an item; and `nested`, given to the
 * items.
 *
 * @remarks
 * The element's binding creates it, calls {@link TreeViewController.connect} and {@link TreeViewController.disconnect} with the element's
 * lifecycle, and {@link TreeViewController.setItems} when its items change. The controller observes the items under them, and their
 * `expanded` and `selected` attributes, which aren't its own.
 *
 * @public
 */
export class TreeViewController {
    private items: readonly TreeItemElement[] = [];
    private readonly rovingFocus: RovingFocusController<TreeItemElement>;
    private readonly observer = new MutationObserver(records => this.mutated(records));

    constructor(private readonly host: TreeViewElement, internals: TreeViewInternals, private readonly options: TreeViewOptions) {
        internals.role = "tree";
        // A disabled tree item stays focusable, as the ARIA practices ask, so the user finds it.
        this.rovingFocus = new RovingFocusController<TreeItemElement>(host, {
            keys: "vertical",
            homeEnd: true,
            wrap: false,
            isDisabled: () => false,
        });
    }

    /**
     * Starts handling the keyboard and clicks, and observing the items. For when the element is connected.
     */
    public connect(): void {
        this.rovingFocus.connect();
        this.host.addEventListener("keydown", this.handleKeydown);
        this.host.addEventListener("click", this.handleClick);
        this.observer.observe(this.host, { subtree: true, childList: true, attributes: true, attributeFilter: ["expanded", "selected"] });
        this.update();
    }

    /**
     * Stops handling the keyboard and clicks, and observing the items. For when the element is disconnected.
     */
    public disconnect(): void {
        this.rovingFocus.disconnect();
        this.host.removeEventListener("keydown", this.handleKeydown);
        this.host.removeEventListener("click", this.handleClick);
        this.observer.disconnect();
    }

    /**
     * The items of the tree changed: its child tree items.
     */
    public setItems(items: readonly TreeItemElement[]): void {
        this.items = items;
        // Of several selected, the last stays selected.
        const selected = this.all().filter(item => item.selected);
        for (const item of selected.slice(0, -1)) {
            item.selected = false;
        }
        this.update();
    }

    // All the items, in their order, with the items of each after it.
    private all(items: readonly TreeItemElement[] = this.items): TreeItemElement[] {
        return items.flatMap(item => [item, ...this.all(item.items)]);
    }

    // The items that are shown: those whose parents are all expanded.
    private shown(items: readonly TreeItemElement[] = this.items): TreeItemElement[] {
        return items.flatMap(item => [item, ...(item.expanded ? this.shown(item.items) : [])]);
    }

    // An item selected by code unselects the others.
    private mutated(records: readonly MutationRecord[]): void {
        const selected = records
            .filter(record => record.attributeName === "selected" && record.target instanceof Element && this.options.isItem(record.target))
            .map(record => record.target as TreeItemElement)
            .filter(item => item.selected)
            .pop();
        if (selected) {
            this.selectOnly(selected);
        }
        this.update();
    }

    private selectOnly(selected: TreeItemElement): void {
        for (const item of this.all()) {
            if (item !== selected && item.selected) {
                item.selected = false;
            }
        }
    }

    // The user selects an item: it alone is selected.
    private select(item: TreeItemElement): void {
        selectTreeItem(item);
        if (item.selected) {
            this.selectOnly(item);
        }
    }

    private update(): void {
        const all = this.all();
        const nested = all.some(item => item.items.length > 0);
        for (const item of all) {
            item.nested = nested;
        }

        const shown = this.shown();
        this.rovingFocus.setItems(shown);
        const focused = shown.find(item => item === this.host.ownerDocument.activeElement);
        this.rovingFocus.setActive(focused ?? shown.find(item => item.selected) ?? shown[0] ?? null);
    }

    private parentOf(item: TreeItemElement): TreeItemElement | null {
        const parent = item.parentElement;
        return parent && this.options.isItem(parent) ? parent : null;
    }

    // Right and Left expand and collapse, and move to the first item and the parent; Enter selects.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        const item = event.target instanceof Element && this.options.isItem(event.target) ? event.target : null;
        if (event.defaultPrevented || !item) {
            return;
        }

        let focus: TreeItemElement | null = null;
        switch (event.key) {
            case "ArrowRight":
                if (item.items.length > 0) {
                    if (item.expanded) {
                        focus = item.items[0];
                    } else {
                        toggleTreeItem(item);
                    }
                }
                break;
            case "ArrowLeft":
                if (item.items.length > 0 && item.expanded) {
                    toggleTreeItem(item);
                } else {
                    focus = this.parentOf(item);
                }
                break;
            case "Enter":
                this.select(item);
                break;
            default:
                return;
        }

        event.preventDefault();
        this.update();
        if (focus) {
            this.rovingFocus.setActive(focus);
            focus.focus();
        }
    };

    // A click on an item selects it; one on its button expands or collapses it, which its template does.
    private readonly handleClick = (event: MouseEvent): void => {
        if (event.defaultPrevented) {
            return;
        }
        const item = event.composedPath().find((target): target is TreeItemElement => target instanceof Element && this.options.isItem(target));
        if (item) {
            this.select(item);
        }
    };
}
