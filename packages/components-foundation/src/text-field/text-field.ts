import type { TextInputElement } from "../text-input/text-input.js";
import type { TextFieldContract } from "./text-field.generated.js";

/**
 * A text field: a {@link TextInputElement} of one line, around a native `<input>`.
 *
 * @remarks
 * Slots: `label`, and `start` and `end` around the control.
 *
 * @public
 */
export interface TextFieldElement extends TextInputElement, TextFieldContract {}
