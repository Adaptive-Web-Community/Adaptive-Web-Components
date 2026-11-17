/* eslint-disable */
// This file is generated from src/text-input/text-input.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Slot names of Text Input.
 *
 * @public
 */
export const TextInputSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",
} as const;

/**
 * A field the user types text in: a text field, a text area, a number field, or a search field. It wraps a native `<input>` or `<textarea>` (the control), since what the browser does for one (selection, input methods, spelling, autofill) can't be done for a custom element. The host is the form control, through `ElementInternals`, with the control's value and validity.
 *
 * @remarks
 * Its label (see the `labelled` contract) names the control, as an outside `<label for>` does too.
 *
 * Events: `input` (the control's, which leaves the shadow root) and `change` (dispatched from the host, since the control's doesn't).
 *
 * @public
 */
export interface TextInputContract extends LabelledContract {
    /**
     * The value now. Not an attribute: the `value` attribute is the value by default, before the user or code changes it and when its form is reset.
     */
    value: string;

    /**
     * Whether it is disabled. A disabled `<fieldset>` also disables it, which this doesn't reflect: select `:disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: it takes focus and its text can be selected, and the user can't change it. It isn't validated.
     */
    readOnly: boolean;

    /**
     * Whether it must have a value for its form to be valid.
     */
    required: boolean;

    /**
     * The name of its value in the form data.
     */
    name: string | null;

    /**
     * A hint of what to type, shown while it is empty. It isn't a label.
     */
    placeholder: string | null;

    /**
     * The most characters the user can type.
     */
    maxLength: number | null;

    /**
     * The fewest characters of a valid value.
     */
    minLength: number | null;

    /**
     * What the browser can fill it with (`email`, `current-password`, ...).
     */
    autocomplete: string | null;
}
