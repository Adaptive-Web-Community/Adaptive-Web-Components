import { attr, FASTElement, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { type AccordionItemElement, type HeadingLevel, toggleAccordionItem } from "@adaptive-web/components-foundation";

/**
 * An item of an {@link Accordion}. Implements {@link @adaptive-web/components-foundation#AccordionItemElement}.
 *
 * @public
 */
export class AccordionItem extends FASTElement implements AccordionItemElement {
    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.headingLevel}
     */
    @attr({ attribute: "heading-level", mode: "fromView", converter: nullableNumberConverter })
    public headingLevel: HeadingLevel = 2;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.expanded}
     */
    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AccordionItemElement.collapsible}
     */
    @observable
    public collapsible: boolean = true;

    /**
     * The button of the heading.
     *
     * @internal
     */
    public expandButton?: HTMLButtonElement;

    /**
     * Focuses the button of the heading.
     */
    public focus(options?: FocusOptions): void {
        this.expandButton?.focus(options);
    }

    /**
     * @internal
     */
    public handleClick(): void {
        toggleAccordionItem(this);
    }
}
