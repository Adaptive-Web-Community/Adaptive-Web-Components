import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import type { FormControlElement } from "../utilities/form-control.js";
import type { PickerContract } from "./picker.generated.js";

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
 * Slots: `label`, its label (see the `labelled` contract), the default slot for the options, `start` and `end` in the root, `indicator`,
 * and `no-results` and `loading` for the status.
 *
 * Events: `filter`, cancelable, when the user types; the input's `input`; `input` and `change` when the user changes the values.
 *
 * @public
 */
export interface PickerElement extends FormControlElement, PickerContract {
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
