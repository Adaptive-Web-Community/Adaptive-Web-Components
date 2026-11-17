/* eslint-disable */
// This file is generated from src/picker/picker.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Part names of Picker for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const PickerParts = {
    /** The `label` slot or `label` attribute text in a `<label for>` that names the control. */
    label: "label",

    /** The box of the field, around the values and the input. */
    root: "root",

    /** The list of the values (`role="list"`), before the input, in multiple selection. */
    values: "values",

    /** A value in the list (`role="listitem"`). */
    value: "value",

    /** The label of a value. */
    valueLabel: "value-label",

    /** The button that removes a value, for the pointer. */
    valueRemove: "value-remove",

    /** The native input (`role="combobox"`), which has the focus. */
    control: "control",

    /** The indicator that it opens. */
    indicator: "indicator",

    /** The popup, a popover anchored to the root, with the listbox and the status. */
    popup: "popup",

    /** The list of the options (`role="listbox"`). */
    listbox: "listbox",

    /** The status of the popup (`role="status"`): loading or no results. */
    status: "status",
} as const;

/**
 * Slot names of Picker.
 *
 * @public
 */
export const PickerSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Optional content before the input in the root. */
    start: "start",

    /** Optional content after the indicator in the root. */
    end: "end",

    /** Replaces the default open indicator. */
    indicator: "indicator",

    /** Replaces the default no-results text in the status. */
    noResults: "no-results",

    /** Replaces the default loading text in the status. */
    loading: "loading",
} as const;

/**
 * A **Picker** is a combobox that suggests options from a popup as the user types, and takes one value or several listed before the input.
 *
 * @public
 */
export interface PickerContract extends LabelledContract {
    /**
     * The name of its values in the form data.
     */
    name: string | null;

    /**
     * Whether it takes any number of values, or one.
     */
    multiple: boolean;

    /**
     * Whether it takes values that aren't options: the text typed.
     */
    freeform: boolean;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: the user can't change its values.
     */
    readOnly: boolean;

    /**
     * Whether a value is needed for its form to be valid.
     */
    required: boolean;

    /**
     * Whether the author is finding options; the status says so.
     */
    loading: boolean;

    /**
     * The text shown in the empty input.
     */
    placeholder: string | null;

    /**
     * Whether the popup is open.
     */
    open: boolean;

    /**
     * The first value, or an empty string without one.
     */
    value: string;
}
