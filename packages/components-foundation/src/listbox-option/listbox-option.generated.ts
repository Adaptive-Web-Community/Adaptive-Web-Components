/* eslint-disable */
// This file is generated from src/listbox-option/listbox-option.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Listbox Option for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const ListboxOptionParts = {
    /** The default slot label and any inline content between optional `start` and `end` slots. */
    content: "content",
} as const;

/**
 * Slot names of Listbox Option.
 *
 * @public
 */
export const ListboxOptionSlots = {
    /** The option label. */
    default: "",

    /** Optional content before the label. */
    start: "start",

    /** Optional content after the label. */
    end: "end",
} as const;

/**
 * An **Listbox Option** is one choice in a listbox, select, or picker (`role="option"`), as a native `<option>`. It does not take focus; the listbox points at the active option with `aria-activedescendant`.
 *
 * @public
 */
export interface ListboxOptionContract {
    /**
     * The value it gives to the form when it is selected. Without it, its text, as a native option's.
     */
    value: string;

    /**
     * Whether it is selected now.
     */
    selected: boolean;

    /**
     * Whether it is disabled: the keys reach it, and it can't be selected.
     */
    disabled: boolean;

    /**
     * Whether it is the active option in its listbox.
     */
    active: boolean;
}
