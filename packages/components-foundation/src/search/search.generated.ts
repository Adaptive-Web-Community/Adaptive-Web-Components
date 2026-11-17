/* eslint-disable */
// This file is generated from src/search/search.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { TextInputContract } from "../text-input/text-input.generated.js";

/**
 * Part names of Search for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const SearchParts = {
    /** The `label` slot or `label` attribute text in a `<label for>` that names the control. */
    label: "label",

    /** The box around the control, the clear button, and the `start` and `end` slots. */
    root: "root",

    /** Wraps the control and the clear button. */
    inputWrapper: "input-wrapper",

    /** The native `<input type="search">`; receives DOM focus and shows the text cursor. */
    control: "control",

    /** The button that clears the value, hidden without a value or when read only. */
    clearButton: "clear-button",
} as const;

/**
 * Slot names of Search.
 *
 * @public
 */
export const SearchSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Optional content before the control, commonly an icon. */
    start: "start",

    /** Optional content after the control, commonly an icon or affordance. */
    end: "end",

    /** Replaces the glyph of the clear button. */
    clearGlyph: "clear-glyph",
} as const;

/**
 * A **Search** is a field that the user types a search in. It is a text input around a native `<input type="search">` (the `searchbox` role), with a clear button. The clear button is for the pointer, not the tab order: Escape clears a search field.
 *
 * @public
 */
export interface SearchContract extends TextInputContract {
    /**
     * A regular expression that a valid value matches.
     */
    pattern: string | null;
}
