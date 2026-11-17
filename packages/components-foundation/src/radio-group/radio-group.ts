import type { FormControlElement } from "../utilities/form-control.js";
import type { RadioGroupContract } from "./radio-group.generated.js";

/**
 * A radio group (`role="radiogroup"`): radios of which one is checked. The arrow keys move the focus between the radios and check the one
 * they move to, and only that radio is in the tab order.
 *
 * @remarks
 * Each radio gives its value to the form (see `RadioElement`). The group is a form control too, without a value of its own, for its
 * validity when it is required, and for its disabled state: its `disabled` attribute or a disabled `<fieldset>` around it make it
 * `:disabled`, and it disables its radios.
 *
 * Slots: `label`, its label (see the `labelled` contract), and the default slot for the radios.
 *
 * Events: the `input` and `change` of a radio bubble through it.
 *
 * @public
 */
export interface RadioGroupElement extends FormControlElement, RadioGroupContract {}
