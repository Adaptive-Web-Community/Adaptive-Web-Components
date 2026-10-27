import { type TextControl, TextInputController, type TextInputInternals } from "../text-input/text-input.controller.js";
import type { TextAreaElement } from "./text-area.js";

/**
 * The behavior of a {@link TextAreaElement}: a {@link TextInputController}, without implicit submission, and its rows and columns.
 *
 * @public
 */
export class TextAreaController extends TextInputController<TextAreaElement> {
    constructor(host: TextAreaElement, internals: TextInputInternals) {
        super(host, internals, { implicitSubmission: false });
    }

    protected sync(control: TextControl): void {
        super.sync(control);
        this.setControlAttribute(control, "rows", this.host.rows);
        this.setControlAttribute(control, "cols", this.host.cols);
    }
}
