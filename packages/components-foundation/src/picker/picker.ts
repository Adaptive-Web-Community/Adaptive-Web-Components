import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import type { FormControlElement } from "../utilities/form-control.js";

/**
 * The parts of a {@link PickerElement}.
 *
 * @public
 */
export const PickerParts = {
    /** The box of the field, around the values and the input. */
    root: "root",

    /** The list of the values (`role="list"`), before the input, in multiple selection. */
    values: "values",

    /** A value in the list (`role="listitem"`). */
    value: "value",

    /** The label of a value. */
    valueLabel: "value-label",

    /** The button that removes a value, for the mouse: Backspace in the empty input removes the last. */
    valueRemove: "value-remove",

    /** The native input (`role="combobox"`), which has the focus. */
    control: "control",

    /** The indicator that it opens. */
    indicator: "indicator",

    /** The popup, a popover anchored to the root, with the listbox and the status. */
    popup: "popup",

    /** The list of the options (`role="listbox"`). */
    listbox: "listbox",

    /** The status of the popup (`role="status"`): that the options are loading, or that none is found. */
    status: "status",
} as const;

/**
 * A picker: an input that suggests options as the user types, from a popup, and takes one value, or several, listed before the input. Implements the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ | ARIA combobox pattern} with list autocomplete, with {@link PickerController}.
 *
 * @remarks
 * The host is the form control; its template has the native input (`role="combobox"`), to which it delegates its focus, and the popup, a
 * popover next to it in the shadow root, with the listbox and its status. In single selection, the input shows the selected option; with
 * `freeform`, its text is the value when no option has it, as a combobox's. In multiple selection, the input is for typing to find options,
 * and the values are listed before it; with `freeform`, Enter adds what is typed.
 *
 * As the user types, the picker emits `filter`, which can be canceled, and then hides the options whose text doesn't contain what is typed.
 * An author who finds the options otherwise (from a server) cancels it, sets `loading` while finding them, and changes the options. The
 * popup's status says that the options are loading, or that none is found.
 *
 * Slots: the default slot for the options, `start` and `end` in the root, `indicator`, and `no-results` and `loading` for the status.
 *
 * Events: `filter`, cancelable, when the user types; the input's `input`; `input` and `change` when the user changes the values.
 *
 * @public
 */
export interface PickerElement extends FormControlElement {
    /**
     * The name of its values in the form data.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * Whether it takes any number of values, listed before the input, or one.
     *
     * @remarks
     * HTML attribute: `multiple`.
     */
    multiple: boolean;

    /**
     * Whether it takes values that aren't options: the text typed.
     *
     * @remarks
     * HTML attribute: `freeform`.
     */
    freeform: boolean;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: the user can't change its values.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;

    /**
     * Whether a value is needed for its form to be valid.
     *
     * @remarks
     * HTML attribute: `required`.
     */
    required: boolean;

    /**
     * Whether the author is finding the options, after canceling `filter`: the popup's status says so, instead of that none is found.
     *
     * @remarks
     * HTML attribute: `loading`.
     */
    loading: boolean;

    /**
     * The text shown in the empty input.
     *
     * @remarks
     * HTML attribute: `placeholder`.
     */
    placeholder: string | null;

    /**
     * The first value, or `""` without one. Setting it selects the option with the value, or, with `freeform`, takes the text.
     */
    value: string;

    /**
     * The values: the selected options' values, and the text the user gave with `freeform`.
     */
    readonly values: readonly string[];

    /**
     * What the user typed to find options, which the options are filtered by.
     */
    readonly query: string;

    /**
     * The selected options.
     */
    readonly selectedOptions: readonly ListboxOptionElement[];
}
