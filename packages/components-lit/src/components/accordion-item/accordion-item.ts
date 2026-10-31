import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { AccordionItemController, type AccordionItemElement, type HeadingLevel } from "@adaptive-web/components-foundation";

/**
 * An item of an {@link Accordion}. Implements {@link @adaptive-web/components-foundation#AccordionItemElement}.
 *
 * @slot heading - The content of the button of the heading.
 * @slot - The content of the panel.
 * @slot start - Content after the button.
 * @slot end - Content after the button.
 * @slot collapsed-icon - The icon of a collapsed item.
 * @slot expanded-icon - The icon of an expanded item.
 * @fires change - The user expanded or collapsed the item.
 * @csspart heading - The heading.
 * @csspart button - The button of the heading.
 * @csspart heading-content - The content of the button.
 * @csspart icon - The icon.
 * @csspart panel - The panel.
 *
 * @public
 */
export class AccordionItem extends LitElement implements AccordionItemElement {
    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.headingLevel}
     */
    @property({ attribute: "heading-level", type: Number })
    public headingLevel: HeadingLevel = 2;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.expanded}
     */
    @property({ type: Boolean, reflect: true })
    public expanded: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.disabled}
     */
    @property({ type: Boolean, reflect: true })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.collapsible}
     */
    @property({ attribute: false })
    public collapsible: boolean = true;

    private readonly controller = new AccordionItemController(this, () => this.shadowRoot);

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    /**
     * Focuses the button of the heading.
     */
    public focus(options?: FocusOptions): void {
        this.controller.focus(options);
    }
}
