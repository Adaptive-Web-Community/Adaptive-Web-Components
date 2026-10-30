import { type TextControl, TextInputController, type TextInputInternals } from "../text-input/text-input.controller.js";
import type { TextFieldElement } from "./text-field.js";

/**
 * The behavior of a {@link TextFieldElement}: a {@link TextInputController}, with Enter submitting the form, and its type and pattern.
 *
 * @public
 */
export class TextFieldController extends TextInputController<TextFieldElement> {
    constructor(host: TextFieldElement, internals: TextInputInternals) {
        super(host, internals, { implicitSubmission: true });
    }

    protected sync(control: TextControl): void {
        super.sync(control);
        this.setControlAttribute(control, "type", this.host.type);
        this.setControlAttribute(control, "pattern", this.host.pattern);
    }
}
