import type { FormControlElement } from "../utilities/form-control.js";
import type { TextInputContract } from "./text-input.generated.js";

/**
 * A field the user types text in: a text field, a text area, a number field, or a search field. It wraps a native `<input>` or `<textarea>`
 * (the control), since what the browser does for one (selection, input methods, spelling, autofill) can't be done for a custom element. The
 * host is the form control, through `ElementInternals`, with the control's value and validity.
 *
 * @remarks
 * Its label (see {@link LabelledContract}) names the control, as an outside `<label for>` does too.
 *
 * Events: `input` (the control's, which leaves the shadow root) and `change` (dispatched from the host, since the control's doesn't).
 *
 * @public
 */
export interface TextInputElement extends FormControlElement, TextInputContract {
    /**
     * The value by default: before the user or code changes it, and when its form is reset.
     *
     * @remarks
     * HTML attribute: `value`.
     */
    defaultValue: string;
}
