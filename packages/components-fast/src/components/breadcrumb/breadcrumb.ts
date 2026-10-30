import { FASTElement, observable } from "@microsoft/fast-element";
import { breadcrumbAria, type BreadcrumbElement, setBreadcrumbItems } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";
import { BreadcrumbItem } from "../breadcrumb-item/breadcrumb-item.js";

/**
 * A breadcrumb of {@link BreadcrumbItem}s. Implements {@link @adaptive-web/components-foundation#BreadcrumbElement}.
 *
 * @public
 */
export class Breadcrumb extends FASTElement implements BreadcrumbElement {
    private readonly internals = this.attachInternals();

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

    constructor() {
        super();
        Object.assign(this.internals, breadcrumbAria());
    }

    private updateItems(): void {
        setBreadcrumbItems(this.slottedElements.filter((element): element is BreadcrumbItem => element instanceof BreadcrumbItem));

        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateItems());
    }
}
