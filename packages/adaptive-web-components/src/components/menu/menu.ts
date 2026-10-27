import { FASTElement, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { MenuController, type MenuElement } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";
import { MenuItem } from "../menu-item/menu-item.js";

/**
 * A menu of {@link MenuItem}s. Implements {@link @adaptive-web/components-foundation#MenuElement}.
 *
 * @public
 */
export class Menu extends FASTElement implements MenuElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    private readonly controller = new MenuController(this, this.internals, {
        isItem: (element): element is MenuItem => element instanceof MenuItem,
    });
    private items: MenuItem[] = [];
    private readonly checkedSubscriber: Subscriber = {
        handleChange: (item: MenuItem) => this.controller.itemCheckedChanged(item),
    };

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateElements();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    private updateElements(): void {
        for (const item of this.items) {
            Observable.getNotifier(item).unsubscribe(this.checkedSubscriber, "checked");
        }

        this.items = this.slottedElements.filter((element): element is MenuItem => element instanceof MenuItem);

        for (const item of this.items) {
            Observable.getNotifier(item).subscribe(this.checkedSubscriber, "checked");
        }

        this.controller.setElements(this.slottedElements);

        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateElements());
    }
}
