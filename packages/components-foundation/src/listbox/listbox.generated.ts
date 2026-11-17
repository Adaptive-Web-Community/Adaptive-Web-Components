/* eslint-disable */
// This file is generated from src/listbox/listbox.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Part names of Listbox for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const ListboxParts = {
    /** The `label` slot or `label` attribute text that names the listbox, hidden from assistive technology so it isn't read twice. */
    label: "label",

    /** The box of the options, which scrolls. */
    options: "options",
} as const;

/**
 * Slot names of Listbox.
 *
 * @public
 */
export const ListboxSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",
} as const;

/**
 * A **Listbox** is a list of options of which one or any number are selected (`role="listbox"`), as a native `<select>` that shows its options. The host takes focus and points at the active option.
 *
 * @public
 */
export interface ListboxContract extends LabelledContract {
    /**
     * The name of its values in the form data.
     */
    name: string | null;

    /**
     * Whether any number of options can be selected, or one.
     */
    multiple: boolean;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: the keys move between options, and the user can't change the selection.
     */
    readOnly: boolean;

    /**
     * Whether an option must be selected for its form to be valid.
     */
    required: boolean;

    /**
     * The value of the first selected option, or an empty string when none is.
     */
    value: string;
}
