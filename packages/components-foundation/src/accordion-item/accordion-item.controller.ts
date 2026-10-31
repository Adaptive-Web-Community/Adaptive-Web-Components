import { type AccordionItemElement, AccordionItemParts, toggleAccordionItem } from "./accordion-item.js";

/**
 * The behavior of an {@link AccordionItemElement}: a click of its button expands or collapses it ({@link toggleAccordionItem}), and focusing
 * it focuses its button.
 *
 * @remarks
 * The element's binding creates it with the root that its template renders into, calls {@link AccordionItemController.connect} and
 * {@link AccordionItemController.disconnect} with the element's lifecycle, and calls {@link AccordionItemController.focus} from the element's
 * `focus`. The template binds the item's state to its parts, and has no behavior.
 *
 * @public
 */
export class AccordionItemController {
    constructor(private readonly host: AccordionItemElement, private readonly root: () => ParentNode | null) {}

    /**
     * Starts handling clicks. For when the element is connected.
     */
    public connect(): void {
        this.host.addEventListener("click", this.handleClick);
    }

    /**
     * Stops handling clicks. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("click", this.handleClick);
    }

    /**
     * Focuses the button of the item.
     */
    public focus(options?: FocusOptions): void {
        this.button()?.focus(options);
    }

    private button(): HTMLElement | null {
        return this.root()?.querySelector<HTMLElement>(`[part~="${AccordionItemParts.button}"]`) ?? null;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const button = this.button();
        if (button && event.composedPath().includes(button)) {
            toggleAccordionItem(this.host);
        }
    };
}
