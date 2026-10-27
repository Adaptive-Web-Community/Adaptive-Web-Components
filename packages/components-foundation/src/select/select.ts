import type { FormControlElement } from "../utilities/form-control.js";

/**
 * The parts of a {@link SelectElement}.
 *
 * @public
 */
export const SelectParts = {
    /** The combobox (`role="combobox"`), which has the focus and shows the selected option. */
    control: "control",

    /** The text of the selected option, in the control. */
    selectedValue: "selected-value",

    /** The indicator that it opens, in the control. */
    indicator: "indicator",

    /** The popup of the options (`role="listbox"`), a popover anchored to the control. */
    listbox: "listbox",
} as const;

/**
 * A select: a combobox that shows the selected option and opens a popup of its options, of which one is selected, as a native `<select>`.
 * Implements the {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/ | ARIA select-only combobox}
 * with {@link SelectController}.
 *
 * @remarks
 * The host is the form control; its template has the combobox, to which the host delegates its focus, and the listbox, a popover next to it
 * in the shadow root, so the combobox references it (`aria-controls`) and points at the active option (`aria-activedescendant`), which is in
 * the light DOM. As a native select, the first option that isn't disabled is selected when none is, as the options change, an option is
 * unselected, or the form is reset; setting `value` to one that no option has selects none.
 *
 * Slots: the default slot for the options, `start` and `end` in the control, and `indicator`.
 *
 * Events: `input` and `change` when the user selects an option.
 *
 * @public
 */
export interface SelectElement extends FormControlElement {
    /**
     * The name of its value in the form data.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: it opens, and the keys move between its options, but the user can't select one.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;

    /**
     * Whether an option with a value must be selected for its form to be valid: a first option with an empty value is a placeholder, as in
     * a native select.
     *
     * @remarks
     * HTML attribute: `required`.
     */
    required: boolean;

    /**
     * The value of the selected option, or `""` when none is. Setting it selects the option with the value, or none when no option has it.
     */
    value: string;
}
