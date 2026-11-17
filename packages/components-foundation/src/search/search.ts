import type { TextInputElement } from "../text-input/text-input.js";
import type { SearchContract } from "./search.generated.js";

/**
 * A search field: a {@link TextInputElement} around a native `<input type="search">` (the `searchbox` role), with a clear button. The
 * clear button is for the pointer, not the tab order: Escape clears a search field.
 *
 * @remarks
 * Slots: `label`, `start` and `end` around the control, and `clear-glyph`.
 *
 * @public
 */
export interface SearchElement extends TextInputElement, SearchContract {
    /**
     * Clears the value, as the user does with the clear button: it emits `input` and `change`, and focuses the field.
     */
    clear(): void;
}
