import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import type { FormControlElement } from "../utilities/form-control.js";
import type { LabelledElement } from "../utilities/label.js";

/**
 * The parts of a {@link ListboxElement}.
 *
 * @public
 */
export const ListboxParts = {
    /** The label: the `label` slot, or the text of the `label` attribute. */
    label: "label",

    /** The box of the options, which scrolls. */
    options: "options",
} as const;

/**
 * A listbox (`role="listbox"`): options of which one or any number are selected, as a native `<select>` that shows its options. Implements
 * the {@link https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ | ARIA listbox pattern} with {@link ListboxController}.
 *
 * @remarks
 * The host is the listbox and the form control, and takes focus; the options don't, and the host points at the active one
 * (`aria-activedescendant`). In single selection, the selection follows the keys.
 *
 * Slots: `label`, its label (see {@link LabelledElement}), and the default slot for the options.
 *
 * Events: `input` and `change` when the user changes the selection.
 *
 * @public
 */
export interface ListboxElement extends FormControlElement, LabelledElement {
    /**
     * The name of its values in the form data.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * Whether any number of options can be selected, or one.
     *
     * @remarks
     * HTML attribute: `multiple`.
     */
    multiple: boolean;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: the keys move between its options, and the user can't change the selection.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;

    /**
     * Whether an option must be selected for its form to be valid.
     *
     * @remarks
     * HTML attribute: `required`.
     */
    required: boolean;

    /**
     * The value of the first selected option, or `""` when none is. Setting it selects the options with the value.
     */
    value: string;

    /**
     * The selected options.
     */
    readonly selectedOptions: readonly ListboxOptionElement[];
}
