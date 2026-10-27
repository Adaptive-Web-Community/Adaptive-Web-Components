import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { ButtonController, type ButtonElement, ButtonType, findById, isIconOnly } from "@adaptive-web/components-foundation";

/**
 * A button. Implements {@link @adaptive-web/components-foundation#ButtonElement}.
 *
 * @remarks
 * Has the `icon-only` custom state when its content is one SVG element and no text.
 *
 * @public
 */
export class Button extends FASTElement implements ButtonElement {
    /**
     * The element is a form control.
     */
    public static readonly formAssociated = true;

    private readonly internals = this.attachInternals();
    private readonly controller = new ButtonController(this, this.internals);

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement."type"}
     */
    @attr
    public type: ButtonType = ButtonType.button;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.name}
     */
    @attr
    public name: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.value}
     */
    @attr
    public value: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formAction}
     */
    @attr({ attribute: "formaction" })
    public formAction: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formEnctype}
     */
    @attr({ attribute: "formenctype" })
    public formEnctype: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formMethod}
     */
    @attr({ attribute: "formmethod" })
    public formMethod: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formNoValidate}
     */
    @attr({ attribute: "formnovalidate", mode: "boolean" })
    public formNoValidate: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ButtonElement.formTarget}
     */
    @attr({ attribute: "formtarget" })
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
    @attr
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
     * The content of the default slot.
     *
     * @internal
     */
    @observable
    public defaultSlottedContent: Node[] = [];
    protected defaultSlottedContentChanged(): void {
        if (isIconOnly(this.defaultSlottedContent)) {
            this.internals.states.add("icon-only");
        } else {
            this.internals.states.delete("icon-only");
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }
}
