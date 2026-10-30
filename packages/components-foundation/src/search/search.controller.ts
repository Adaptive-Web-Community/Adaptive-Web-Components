import { type TextControl, TextInputController, type TextInputInternals } from "../text-input/text-input.controller.js";
import type { SearchElement } from "./search.js";

/**
 * The behavior of a {@link SearchElement}: a {@link TextInputController} on an `<input type="search">`, with its pattern, and clearing by
 * the clear button.
 *
 * @public
 */
export class SearchController extends TextInputController<SearchElement> {
    constructor(host: SearchElement, internals: TextInputInternals) {
        super(host, internals, { implicitSubmission: true });
    }

    /**
     * Clears the value, as the user does, and focuses the field, unless it is read only or disabled.
     */
    public clear(): void {
        const { control } = this;
        if (!control || control.readOnly || control.disabled) {
            return;
        }

        this.setValueAsUser("");
        control.focus();
    }

    protected sync(control: TextControl): void {
        super.sync(control);
        this.setControlAttribute(control, "type", "search");
        this.setControlAttribute(control, "pattern", this.host.pattern);
    }
}
