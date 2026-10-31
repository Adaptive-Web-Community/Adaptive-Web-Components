import { LitElement } from "lit";
import { property } from "lit/decorators.js";
import { ButtonController, type ButtonElement, ButtonType, findById } from "@adaptive-web/components-foundation";

/**
 * A button. Implements {@link @adaptive-web/components-foundation#ButtonElement}.
 *
 * @tagname adaptive-button
 * @slot start - Content before the label.
 * @slot - The label.
 * @slot end - Content after the label.
 * @csspart content - The label.
 *
 * @public
 */
export class Button extends LitElement implements ButtonElement {
    /**
     * The element is a form control.
     */
    public static readonly formAssociated = true;

    private readonly internals = this.attachInternals();
    private readonly controller = new ButtonController(this, this.internals);

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.disabled}
     */
    @property({ type: Boolean, reflect: true })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement."type"}
     */
    @property({ reflect: true })
    public type: ButtonType = ButtonType.button;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.name}
     */
    @property({ reflect: true })
    public name: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.value}
     */
    @property({ reflect: true })
    public value: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formAction}
     */
    @property({ attribute: "formaction", reflect: true })
    public formAction: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formEnctype}
     */
    @property({ attribute: "formenctype", reflect: true })
    public formEnctype: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formMethod}
     */
    @property({ attribute: "formmethod", reflect: true })
    public formMethod: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formNoValidate}
     */
    @property({ attribute: "formnovalidate", type: Boolean, reflect: true })
    public formNoValidate: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formTarget}
     */
    @property({ attribute: "formtarget", reflect: true })
    public formTarget: string | null = null;

    private explicitCommandFor: Element | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#InvokerElement.commandForElement}
     */
    public get commandForElement(): Element | null {
        return this.explicitCommandFor ?? findById(this, this.getAttribute("commandfor"));
    }
    public set commandForElement(element: Element | null) {
        this.explicitCommandFor = element;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#InvokerElement.command}
     */
    @property({ reflect: true })
    public command: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.form}
     */
    public get form(): HTMLFormElement | null {
        return this.internals.form;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.labels}
     */
    public get labels(): NodeList {
        return this.internals.labels;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.hideLabel}
     */
    @property({ attribute: "hide-label", type: Boolean, reflect: true })
    public hideLabel: boolean = false;

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }
}
