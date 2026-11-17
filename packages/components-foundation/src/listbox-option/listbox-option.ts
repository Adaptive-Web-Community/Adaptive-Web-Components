import type { DefaultAria } from "../utilities/aria.js";
import type { ListboxOptionContract } from "./listbox-option.generated.js";

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
export interface ListboxOptionElement extends HTMLElement, ListboxOptionContract {
    /**
     * Whether it is selected by default: before the user or code changes selection, and when its form is reset.
     *
     * @remarks
     * HTML attribute: `selected`.
     */
    defaultSelected: boolean;

    /**
     * Its label as text, with the white space collapsed, for typing to find it and for showing the selection.
     */
    readonly text: string;
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
