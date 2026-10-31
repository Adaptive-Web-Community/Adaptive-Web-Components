import { LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { MutationController } from "@lit-labs/observers/mutation-controller.js";
import { AccordionController, type AccordionElement, AccordionExpandMode, onDefined } from "@adaptive-web/components-foundation";
import { AccordionItem } from "../accordion-item/accordion-item.js";

/**
 * An accordion of {@link AccordionItem}s. Implements {@link @adaptive-web/components-foundation#AccordionElement}.
 *
 * @tagname adaptive-accordion
 * @slot - The items.
 *
 * @public
 */
export class Accordion extends LitElement implements AccordionElement {
    private readonly controller = new AccordionController(this);
    private items: AccordionItem[] = [];

    // An item reflects `expanded` to its attribute, whether the user or code changed it. The items are children of the host, and one
    // target is observed, since a target of the controller can't be unobserved.
    private readonly expandedObserver = new MutationController(this, {
        config: { attributeFilter: ["expanded"], subtree: true },
        skipInitial: true,
        callback: records => {
            for (const record of records) {
                const item = this.items.find(item => item === record.target);
                if (item) {
                    this.controller.itemExpandedChanged(item);
                }
            }
        },
    });

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionElement.expandMode}
     */
    @property({ attribute: "expand-mode", reflect: true })
    public expandMode: AccordionExpandMode = AccordionExpandMode.multi;

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
        this.renderRoot.addEventListener("slotchange", this.handleSlotChange);
        const slot = this.renderRoot.querySelector("slot");
        if (slot) {
            this.updateItems(slot);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
        this.renderRoot.removeEventListener("slotchange", this.handleSlotChange);
    }

    protected updated(changed: PropertyValues<this>): void {
        if (changed.has("expandMode")) {
            this.controller.expandModeChanged();
        }
    }

    private readonly handleSlotChange = (event: Event): void => {
        if (event.target instanceof HTMLSlotElement) {
            this.updateItems(event.target);
        }
    };

    private updateItems(slot: HTMLSlotElement): void {
        const elements = slot.assignedElements();
        this.items = elements.filter((element): element is AccordionItem => element instanceof AccordionItem);

        this.controller.setItems(this.items);

        onDefined(elements, () => this.updateItems(slot));
    }
}
