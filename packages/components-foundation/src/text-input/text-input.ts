import type { FormControlElement } from "../utilities/form-control.js";

/**
 * A field the user types text in: a text field, a text area, a number field, or a search field. It wraps a native `<input>` or `<textarea>`
 * (the control), since what the browser does for one (selection, input methods, spelling, autofill) can't be done for a custom element. The
 * host is the form control, through `ElementInternals`, with the control's value and validity.
 *
 * @remarks
 * Its default slot is its label, which names the control, as an outside `<label for>` does too.
 *
 * Events: `input` (the control's, which leaves the shadow root) and `change` (dispatched from the host, since the control's doesn't).
 *
 * @public
 */
export interface TextInputElement extends FormControlElement {
    /**
     * The value now.
     *
     * @remarks
     * Not an attribute: the `value` attribute is {@link TextInputElement.defaultValue}.
     */
    value: string;

    /**
     * The value by default: before the user or code changes it, and when its form is reset.
     *
     * @remarks
     * HTML attribute: `value`.
     */
    defaultValue: string;

    /**
     * Whether it is disabled. A disabled `<fieldset>` also disables it, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: it takes focus and its text can be selected, and the user can't change it. It isn't validated.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;

    /**
     * Whether it must have a value for its form to be valid.
     *
     * @remarks
     * HTML attribute: `required`.
     */
    required: boolean;

    /**
     * The name of its value in the form data.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * A hint of what to type, shown while it is empty. It isn't a label.
     *
     * @remarks
     * HTML attribute: `placeholder`.
     */
    placeholder: string | null;

    /**
     * The most characters the user can type.
     *
     * @remarks
     * HTML attribute: `maxlength`.
     */
    maxLength: number | null;

    /**
     * The fewest characters of a valid value.
     *
     * @remarks
     * HTML attribute: `minlength`.
     */
    minLength: number | null;

    /**
     * What the browser can fill it with (`email`, `current-password`, ...).
     *
     * @remarks
     * HTML attribute: `autocomplete`.
     */
    autocomplete: string | null;
}
