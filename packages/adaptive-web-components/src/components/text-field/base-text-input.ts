import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import type { TextControl, TextInputController, TextInputElement } from "@adaptive-web/components-foundation";
import { BaseFormControl } from "../../utilities/base-form-control.js";

/**
 * The base of {@link TextField}, {@link TextArea}, {@link NumberField}, and {@link Search}. Implements
 * {@link @adaptive-web/components-foundation#TextInputElement}, with the controller its component makes. Its template has the control, as
 * `control`, and is defined with `delegatesFocus`, so focusing the element, or a label of it, focuses the control.
 *
 * @public
 */
export abstract class BaseTextInput<C extends TextInputController = TextInputController> extends BaseFormControl implements TextInputElement {
    // Made before the properties, whose change handlers use it while the element is constructed.
    protected readonly controller: C = this.createController(this.internals);

    /**
     * Makes the component's controller.
     */
    protected abstract createController(internals: ElementInternals): C;

    /**
     * The native control.
     *
     * @internal
     */
    public control?: TextControl;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.value}
     */
    @observable
    public value: string = "";
    protected valueChanged(): void {
        this.controller.valueChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.defaultValue}
     */
    @attr({ attribute: "value" })
    public defaultValue: string = "";
    protected defaultValueChanged(): void {
        this.controller.defaultValueChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.readOnly}
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean = false;
    protected readOnlyChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.required}
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;
    protected requiredChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.name}
     */
    @attr
    public name: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.placeholder}
     */
    @attr
    public placeholder: string | null = null;
    protected placeholderChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.maxLength}
     */
    @attr({ attribute: "maxlength", converter: nullableNumberConverter })
    public maxLength: number | null = null;
    protected maxLengthChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.minLength}
     */
    @attr({ attribute: "minlength", converter: nullableNumberConverter })
    public minLength: number | null = null;
    protected minLengthChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextInputElement.autocomplete}
     */
    @attr
    public autocomplete: string | null = null;
    protected autocompleteChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * The content of the default slot, the label.
     *
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[] = [];

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.control) {
            this.controller.connect(this.control);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    /**
     * @internal
     */
    public formResetCallback(): void {
        this.controller.formReset();
    }

    /**
     * The platform calls it for the `disabled` attribute and for a fieldset around the element.
     *
     * @internal
     */
    public formDisabledCallback(disabled: boolean): void {
        this.controller.disabledChanged(disabled);
    }
}
