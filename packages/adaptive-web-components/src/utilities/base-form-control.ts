import { FASTElement } from "@microsoft/fast-element";
import type { FormControlElement } from "@adaptive-web/components-foundation";

/**
 * The base of the form controls: a form-associated element, with its `ElementInternals`, and the form, labels, and validity that a native
 * form control has. Implements {@link @adaptive-web/components-foundation#FormControlElement}.
 *
 * @public
 */
export abstract class BaseFormControl extends FASTElement implements FormControlElement {
    /**
     * The element is a form control.
     */
    public static readonly formAssociated = true;

    protected readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#FormControlElement.form}
     */
    public get form(): HTMLFormElement | null {
        return this.internals.form;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#FormControlElement.labels}
     */
    public get labels(): NodeList {
        return this.internals.labels;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#FormControlElement.validity}
     */
    public get validity(): ValidityState {
        return this.internals.validity;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#FormControlElement.validationMessage}
     */
    public get validationMessage(): string {
        return this.internals.validationMessage;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#FormControlElement.willValidate}
     */
    public get willValidate(): boolean {
        return this.internals.willValidate;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#FormControlElement.checkValidity}
     */
    public checkValidity(): boolean {
        return this.internals.checkValidity();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#FormControlElement.reportValidity}
     */
    public reportValidity(): boolean {
        return this.internals.reportValidity();
    }
}
