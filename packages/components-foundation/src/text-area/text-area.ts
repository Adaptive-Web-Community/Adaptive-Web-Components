import type { TextInputElement } from "../text-input/text-input.js";
import type { TextAreaContract } from "./text-area.generated.js";

/**
 * A text area: a {@link TextInputElement} of several lines, around a native `<textarea>`. Enter starts a line; it doesn't submit the form.
 *
 * @remarks
 * Slots: `label`.
 *
 * @public
 */
export interface TextAreaElement extends TextInputElement, TextAreaContract {}
