import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import type { FormControlElement } from "../utilities/form-control.js";
import type { ListboxContract } from "./listbox.generated.js";

/**
 * A listbox (`role="listbox"`): options of which one or any number are selected, as a native `<select>` that shows its options. Implements
 * the {@link https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ | ARIA listbox pattern} with {@link ListboxController}.
 *
 * @remarks
 * The host is the listbox and the form control, and takes focus; the options don't, and the host points at the active one
 * (`aria-activedescendant`). In single selection, the selection follows the keys.
 *
 * Slots: `label`, its label (see the `labelled` contract), and the default slot for the options.
 *
 * Events: `input` and `change` when the user changes the selection.
 *
 * @public
 */
export interface ListboxElement extends FormControlElement, ListboxContract {
    /**
     * The selected options.
     */
    readonly selectedOptions: readonly ListboxOptionElement[];
}
