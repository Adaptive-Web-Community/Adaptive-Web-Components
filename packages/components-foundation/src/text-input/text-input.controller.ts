import { AriaForwardingController } from "../utilities/aria-forwarding.controller.js";
import type { TextInputElement } from "./text-input.js";

/**
 * The native control a {@link TextInputController} wraps.
 *
 * @public
 */
export type TextControl = HTMLInputElement | HTMLTextAreaElement;

/**
 * What a {@link TextInputController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type TextInputInternals = Pick<ElementInternals, "form" | "labels" | "setFormValue" | "setValidity">;

/**
 * The options of a {@link TextInputController}.
 *
 * @public
 */
export type TextInputOptions = {
    /**
     * Whether Enter submits the form, as in a native `<input>`. Not in a `<textarea>`, where it starts a line.
     */
    implicitSubmission: boolean;
};

// The input types that block implicit submission when a form has more than one of them and no submit button, as the HTML standard has it.
const blockingTypes = ["text", "search", "url", "tel", "email", "password", "date", "month", "week", "time", "datetime-local", "number"];

function setAttribute(element: Element, name: string, value: string | number | null): void {
    if (value === null) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, `${value}`);
    }
}

/**
 * The behavior of a {@link TextInputElement}: the native control kept in step with the element (its value, and the attributes of the
 * contract), the form value and validity from the control, the `value` attribute as the default, reset, `change` from the host, Enter
 * submitting the form, the author's ARIA forwarded to the control, and the outside labels naming it.
 *
 * @remarks
 * The binding creates it with the element's `ElementInternals`, calls {@link TextInputController.connect} with the control once the template
 * rendered and {@link TextInputController.disconnect} with the element's lifecycle, {@link TextInputController.defaultValueChanged} when the
 * `value` attribute changes, {@link TextInputController.valueChanged} when `value` changes, {@link TextInputController.stateChanged} when
 * anything else of the contract changes, {@link TextInputController.disabledChanged} from `formDisabledCallback`, and
 * {@link TextInputController.formReset} from `formResetCallback`. The controller writes the attributes of the contract to the control, not the
 * template, so the validity is right as soon as they change.
 *
 * @public
 */
export class TextInputController<T extends TextInputElement = TextInputElement> {
    // Whether the user or code changed the value, after which the `value` attribute no longer sets it, as for a native input.
    private dirty = false;
    protected control: TextControl | null = null;
    private readonly ariaForwarding: AriaForwardingController;

    constructor(protected readonly host: T, protected readonly internals: TextInputInternals, private readonly options: TextInputOptions) {
        this.ariaForwarding = new AriaForwardingController(host);
    }

    /**
     * Starts keeping the control in step, and handling its events. For when the element is connected and has rendered its control.
     */
    public connect(control: TextControl): void {
        this.control = control;
        // As an HTMLElement, so its event map types the listeners.
        const element: HTMLElement = control;
        element.addEventListener("input", this.handleInput);
        element.addEventListener("change", this.handleChange);
        element.addEventListener("keydown", this.handleKeydown);
        element.addEventListener("focus", this.handleFocus);
        this.ariaForwarding.connect(control);
        control.value = this.host.value;
        this.labelsChanged();
        this.stateChanged();
    }

    /**
     * Stops handling the control's events. For when the element is disconnected.
     */
    public disconnect(): void {
        const element: HTMLElement | null = this.control;
        if (element) {
            element.removeEventListener("input", this.handleInput);
            element.removeEventListener("change", this.handleChange);
            element.removeEventListener("keydown", this.handleKeydown);
            element.removeEventListener("focus", this.handleFocus);
        }
        this.ariaForwarding.disconnect();
    }

    /**
     * The `value` attribute changed. It sets `value` until the user or code changes `value`.
     */
    public defaultValueChanged(): void {
        if (!this.dirty) {
            this.host.value = this.host.defaultValue;
        }
    }

    /**
     * `value` changed, by the user or by code.
     */
    public valueChanged(): void {
        if (this.control && this.control.value !== this.host.value) {
            this.control.value = this.host.value;
        }
        this.stateChanged();
    }

    /**
     * Something else of the contract changed: writes it to the control, and updates the form value and the validity.
     */
    public stateChanged(): void {
        const { control, host, internals } = this;
        if (!control) {
            return;
        }

        this.sync(control);
        internals.setFormValue(host.value);
        if (control.validity.valid) {
            internals.setValidity({});
        } else {
            internals.setValidity(control.validity, control.validationMessage, control);
        }
    }

    /**
     * The element was disabled or enabled, by its `disabled` attribute or a fieldset around it.
     */
    public disabledChanged(disabled: boolean): void {
        if (this.control) {
            this.control.disabled = disabled;
        }
        this.stateChanged();
    }

    /**
     * The element's form was reset: its value is the default again, and the `value` attribute sets it again.
     */
    public formReset(): void {
        this.dirty = false;
        this.host.value = this.host.defaultValue;
        this.valueChanged();
    }

    /**
     * The labels of the element may have changed. An outside `<label for>` names the element, which isn't the control, so the control is
     * labelled by its own label and those.
     */
    public labelsChanged(): void {
        const { control, internals } = this;
        if (!control) {
            return;
        }

        const outside = Array.from(internals.labels).filter((node): node is Element => node instanceof Element);
        const own = control.labels ? Array.from(control.labels) : [];
        control.ariaLabelledByElements = outside.length > 0 ? [...own, ...outside] : null;
    }

    /**
     * Writes the attributes of the contract to the control. A component that has more extends it.
     */
    protected sync(control: TextControl): void {
        const { host } = this;
        control.required = host.required;
        control.readOnly = host.readOnly;
        setAttribute(control, "placeholder", host.placeholder);
        setAttribute(control, "maxlength", host.maxLength);
        setAttribute(control, "minlength", host.minLength);
        setAttribute(control, "autocomplete", host.autocomplete);
    }

    /**
     * Writes an attribute to the control, or removes it when it is `null`. For {@link TextInputController.sync}.
     */
    protected setControlAttribute(control: TextControl, name: string, value: string | number | null): void {
        setAttribute(control, name, value);
    }

    /**
     * Sets the value as the user did: the value is no longer the default's, and `input` and `change` are emitted. For what changes the value
     * that isn't the user typing (a step button, a clear button).
     */
    protected setValueAsUser(value: string): void {
        this.dirty = true;
        this.host.value = value;
        this.valueChanged();
        this.host.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        this.host.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private readonly handleInput = (): void => {
        this.dirty = true;
        this.host.value = this.control?.value ?? "";
        this.valueChanged();
    };

    // The control's `change` doesn't leave the shadow root.
    private readonly handleChange = (): void => {
        this.host.dispatchEvent(new Event("change", { bubbles: true }));
    };

    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Enter" && !event.defaultPrevented && this.options.implicitSubmission) {
            this.submit();
        }
    };

    private readonly handleFocus = (): void => {
        this.labelsChanged();
    };

    // As a native input's implicit submission: the form's first submit button is clicked, or, without one, the form is submitted when this is
    // its only field that blocks implicit submission.
    private submit(): void {
        const form = this.internals.form;
        if (!form) {
            return;
        }

        const elements = Array.from(form.elements);
        const button = elements.find(element => "type" in element && element.type === "submit");
        if (button) {
            if (button instanceof HTMLElement && !button.matches(":disabled")) {
                button.click();
            }
            return;
        }

        const blocking = elements.filter(element => "type" in element && typeof element.type === "string" && blockingTypes.includes(element.type));
        if (blocking.length <= 1) {
            form.requestSubmit();
        }
    }
}
