import type { FormControlElement } from "../utilities/form-control.js";
import type { SelectContract } from "./select.generated.js";

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
 * Slots: `label`, its label (see the `labelled` contract), the default slot for the options, `start` and `end` in the control, and
 * `indicator`.
 *
 * Events: `input` and `change` when the user selects an option.
 *
 * @public
 */
export interface SelectElement extends FormControlElement, SelectContract {}
