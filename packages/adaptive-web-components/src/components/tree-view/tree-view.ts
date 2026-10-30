import { FASTElement, observable } from "@microsoft/fast-element";
import { TreeViewController, type TreeViewElement } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";
import { TreeItem } from "../tree-item/tree-item.js";

/**
 * A tree view of {@link TreeItem}s. Implements {@link @adaptive-web/components-foundation#TreeViewElement}.
 *
 * @public
 */
export class TreeView extends FASTElement implements TreeViewElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    private readonly controller = new TreeViewController(this, this.internals, {
        isItem: (element): element is TreeItem => element instanceof TreeItem,
    });

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateItems();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    private updateItems(): void {
        this.controller.setItems(this.slottedElements.filter((element): element is TreeItem => element instanceof TreeItem));
        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateItems());
    }
}

