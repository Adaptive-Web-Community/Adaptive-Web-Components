import { attr, FASTElement, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { AccordionController, type AccordionElement, AccordionExpandMode } from "@adaptive-web/components-foundation";
import { AccordionItem } from "../accordion-item/accordion-item.js";

/**
 * An accordion of {@link AccordionItem}s. Implements {@link @adaptive-web/components-foundation#AccordionElement}.
 *
 * @public
 */
export class Accordion extends FASTElement implements AccordionElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly controller = new AccordionController(this);
    private items: AccordionItem[] = [];
    private readonly expandedSubscriber: Subscriber = {
        handleChange: (item: AccordionItem) => this.controller.itemExpandedChanged(item),
    };

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionElement.expandMode}
     */
    @attr({ attribute: "expand-mode" })
    public expandMode: AccordionExpandMode = AccordionExpandMode.multi;
    protected expandModeChanged(): void {
        this.controller.expandModeChanged();
    }

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
        for (const item of this.items) {
            Observable.getNotifier(item).unsubscribe(this.expandedSubscriber, "expanded");
        }

        this.items = this.slottedElements.filter((element): element is AccordionItem => element instanceof AccordionItem);

        for (const item of this.items) {
            Observable.getNotifier(item).subscribe(this.expandedSubscriber, "expanded");
        }

        this.controller.setItems(this.items);

        // An item that isn't defined yet is an item once it is, which doesn't change what is slotted.
        const registry = this.$fastController.definition.registry;
        for (const element of this.slottedElements) {
            if (!element.matches(":defined")) {
                void registry.whenDefined(element.localName).then(() => this.updateItems());
            }
        }
    }
}
