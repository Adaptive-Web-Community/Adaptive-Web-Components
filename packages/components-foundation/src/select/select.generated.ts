/* eslint-disable */
// This file is generated from src/select/select.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Part names of Select for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const SelectParts = {
    /** The `label` slot or `label` attribute text that names the select. */
    label: "label",

    /** The combobox, which has the focus and shows the selected option. */
    control: "control",

    /** The text of the selected option, in the control. */
    selectedValue: "selected-value",

    /** The indicator that it opens, in the control. */
    indicator: "indicator",

    /** The popup of the options (`role="listbox"`), a popover anchored to the control. */
    listbox: "listbox",
} as const;

/**
 * Slot names of Select.
 *
 * @public
 */
export const SelectSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Optional content before the selected value in the control. */
    start: "start",

    /** Optional content after the indicator in the control. */
    end: "end",

    /** Replaces the default open indicator in the control. */
    indicator: "indicator",
} as const;

/**
 * A **Select** is a combobox that shows the selected option and opens a popup of options (`role="combobox"`), as a native `<select>`. The host is the form control.
 *
 * @public
 */
export interface SelectContract extends LabelledContract {
    /**
     * The name of its value in the form data.
     */
    name: string | null;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: it opens, and the keys move, but the user can't select.
     */
    readOnly: boolean;

    /**
     * Whether an option with a value must be selected for its form to be valid.
     */
    required: boolean;

    /**
     * Whether the popup is open.
     */
    open: boolean;

    /**
     * The value of the selected option, or an empty string when none is.
     */
    value: string;
}
