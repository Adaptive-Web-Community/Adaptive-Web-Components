import type { AccordionItemElement } from "../accordion-item/accordion-item.js";
import { type AccordionElement, AccordionExpandMode } from "./accordion.js";

/**
 * The behavior of an {@link AccordionElement}: the arrow keys, Home, and End move the focus between the headings of its items, and in the
 * `single` expand mode one item is expanded at a time.
 *
 * @remarks
 * The element's binding creates it, calls {@link AccordionController.connect} and {@link AccordionController.disconnect} with the element's
 * lifecycle, and calls {@link AccordionController.setItems}, {@link AccordionController.expandModeChanged}, and
 * {@link AccordionController.itemExpandedChanged} when its framework observes those changes.
 *
 * @public
 */
export class AccordionController {
    private items: readonly AccordionItemElement[] = [];

    constructor(private readonly host: AccordionElement) {}

    /**
     * Starts handling the keyboard. For when the element is connected.
     */
    public connect(): void {
        this.host.addEventListener("keydown", this.handleKeydown);
    }

    /**
     * Stops handling the keyboard. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("keydown", this.handleKeydown);
    }

    /**
     * The items of the accordion changed.
     *
     * @remarks
     * In the `single` expand mode, the first expanded item stays expanded and the others are collapsed. When none is expanded, the first that
     * isn't disabled is expanded.
     */
    public setItems(items: readonly AccordionItemElement[]): void {
        this.items = items;
        this.applyExpandMode();
    }

    /**
     * The expand mode of the accordion changed.
     */
    public expandModeChanged(): void {
        this.applyExpandMode();
    }

    /**
     * An item was expanded or collapsed, by the user or by code.
     */
    public itemExpandedChanged(item: AccordionItemElement): void {
        if (item.expanded && this.host.expandMode === AccordionExpandMode.single) {
            this.expandOnly(item);
        }
    }

    private applyExpandMode(): void {
        if (this.host.expandMode === AccordionExpandMode.single) {
            const expanded = this.items.find(item => item.expanded) ?? this.items.find(item => !item.disabled);
            if (expanded) {
                this.expandOnly(expanded);
            }
        } else {
            for (const item of this.items) {
                item.collapsible = true;
            }
        }
    }

    private expandOnly(expanded: AccordionItemElement): void {
        for (const item of this.items) {
            item.expanded = item === expanded;
            item.collapsible = item !== expanded;
        }
    }

    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented) {
            return;
        }

        // A key in the heading of an item has the item as its target. A key in a panel has the element of the panel, so it isn't handled.
        const items = this.items.filter(item => !item.disabled);
        const index = items.findIndex(item => item === event.target);
        if (index < 0) {
            return;
        }

        let next: number;
        switch (event.key) {
            case "ArrowDown":
                next = (index + 1) % items.length;
                break;
            case "ArrowUp":
                next = (index - 1 + items.length) % items.length;
                break;
            case "Home":
                next = 0;
                break;
            case "End":
                next = items.length - 1;
                break;
            default:
                return;
        }

        event.preventDefault();
        items[next].focus();
    };
}
