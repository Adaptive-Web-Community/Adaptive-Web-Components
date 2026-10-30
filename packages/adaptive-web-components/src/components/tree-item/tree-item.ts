import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { placeTreeItems, toggleTreeItem, treeItemAria, type TreeItemElement } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";

/**
 * An item of a {@link TreeView}. Implements {@link @adaptive-web/components-foundation#TreeItemElement}.
 *
 * @remarks
 * Has the `nested` custom state when its tree has items with items.
 *
 * @public
 */
export class TreeItem extends FASTElement implements TreeItemElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TreeItemElement.items}
     */
    @observable
    public items: TreeItem[] = [];
    protected itemsChanged(): void {
        placeTreeItems(this.items);
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TreeItemElement.expanded}
     */
    @attr({ mode: "boolean" })
    public expanded: boolean = false;
    protected expandedChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TreeItemElement.selected}
     */
    @attr({ mode: "boolean" })
    public selected: boolean = false;
    protected selectedChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TreeItemElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;
    protected disabledChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TreeItemElement.nested}
     */
    @observable
    public nested: boolean = false;
    protected nestedChanged(): void {
        if (this.nested) {
            this.internals.states.add("nested");
        } else {
            this.internals.states.delete("nested");
        }
    }

    /**
     * The child elements.
     *
     * @internal
     */
    @observable
    public childElements: Element[] = [];
    protected childElementsChanged(): void {
        this.updateItems();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        // Focusable by its tree, which owns its tabindex.
        if (!this.hasAttribute("tabindex")) {
            this.tabIndex = -1;
        }
    }

    /**
     * @internal
     */
    public handleExpandCollapseClick(): void {
        toggleTreeItem(this);
    }

    private updateItems(): void {
        this.items = this.childElements.filter((element): element is TreeItem => element instanceof TreeItem);
        if (this.$fastController.definition) {
            onDefined(this.childElements, this.$fastController.definition.registry, () => this.updateItems());
        }
    }

    private updateAria(): void {
        Object.assign(this.internals, treeItemAria(this));
    }
}
