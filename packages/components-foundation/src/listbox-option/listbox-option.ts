import type { DefaultAria } from "../utilities/aria.js";

/**
 * The parts of a {@link ListboxOptionElement}.
 *
 * @public
 */
export const ListboxOptionParts = {
    /** The container of the default slot, between `start` and `end`. */
    content: "content",
} as const;

/**
 * An option of a listbox (`role="option"`), in a Listbox, a Select, or a Picker, as a native `<option>`.
 *
 * @remarks
 * It doesn't take focus: the element with the focus points at the active option (`aria-activedescendant`), which shows it with the `active`
 * custom state, and its selection with `selected`.
 *
 * Slots: the default slot for its label, between `start` and `end`.
 *
 * @public
 */
export interface ListboxOptionElement extends HTMLElement {
    /**
     * The value it gives to the form when it is selected.
     *
     * @remarks
     * HTML attribute: `value`. Without it, its text, as a native option's.
     */
    value: string;

    /**
     * Its label as text, with the white space collapsed, for typing to find it and for showing the selection.
     */
    readonly text: string;

    /**
     * Whether it is selected by default, and when its form is reset.
     *
     * @remarks
     * HTML attribute: `selected`, as a native option's.
     */
    defaultSelected: boolean;

    /**
     * Whether it is selected now. The `selected` attribute sets it until the user or code changes it.
     */
    selected: boolean;

    /**
     * Whether it is disabled: the keys reach it, as the ARIA practices ask of listbox options, and it can't be selected.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is the active option, given by its listbox: the one the keys are on, which the element with the focus points at.
     */
    active: boolean;
}

/**
 * The default ARIA of an option: the `option` role, whether it is selected, and disabled.
 *
 * @public
 */
export function listboxOptionAria(option: ListboxOptionElement): DefaultAria {
    return {
        role: "option",
        ariaSelected: option.selected ? "true" : "false",
        ariaDisabled: option.disabled ? "true" : null,
    };
}

/**
 * The text of an element, with its white space collapsed and trimmed, as a native option's `text`.
 *
 * @public
 */
export function collapsedText(element: Element): string {
    return (element.textContent ?? "").replace(/\s+/g, " ").trim();
}
