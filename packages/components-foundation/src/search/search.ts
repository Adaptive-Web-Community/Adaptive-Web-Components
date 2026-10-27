import type { TextInputElement } from "../text-input/text-input.js";

/**
 * The parts of a {@link SearchElement}.
 *
 * @public
 */
export const SearchParts = {
    /** The label, the content of the default slot. */
    label: "label",

    /** The box around the control, the clear button, and the `start` and `end` slots. */
    root: "root",

    /** The control and the clear button. */
    inputWrapper: "input-wrapper",

    /** The native `<input type="search">`. */
    control: "control",

    /** The button that clears the value. */
    clearButton: "clear-button",
} as const;

/**
 * A search field: a {@link TextInputElement} around a native `<input type="search">` (the `searchbox` role), with a clear button. The
 * clear button is for the pointer, not the tab order: Escape clears a search field.
 *
 * @remarks
 * Slots: the default slot for the label, `start` and `end` around the control, and `clear-glyph`.
 *
 * @public
 */
export interface SearchElement extends TextInputElement {
    /**
     * A regular expression that a valid value matches.
     *
     * @remarks
     * HTML attribute: `pattern`.
     */
    pattern: string | null;

    /**
     * Clears the value, as the user does with the clear button: it emits `input` and `change`, and focuses the field.
     */
    clear(): void;
}
