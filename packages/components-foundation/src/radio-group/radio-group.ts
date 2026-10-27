import type { FormControlElement } from "../utilities/form-control.js";
import type { Orientation } from "../utilities/orientation.js";

/**
 * The parts of a {@link RadioGroupElement}.
 *
 * @public
 */
export const RadioGroupParts = {
    /** The container of the radios, laid out in the orientation. */
    positioningRegion: "positioning-region",
} as const;

/**
 * A radio group (`role="radiogroup"`): radios of which one is checked. The arrow keys move the focus between the radios and check the one
 * they move to, and only that one is in the tab order.
 *
 * @remarks
 * Each radio gives its value to the form (see `RadioElement`). The group is a form control too, without a value of its own, for its
 * validity when it is required. A disabled `<fieldset>` around the group disables its radios, as for native radios.
 *
 * Slots: `label` for the group's label, which names it, and the default slot for the radios.
 *
 * Events: the `input` and `change` of a radio bubble through it.
 *
 * @public
 */
export interface RadioGroupElement extends FormControlElement {
    /**
     * The name of the radios in the form data, given to each of them when it is set.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * The direction in which the radios are laid out.
     *
     * @remarks
     * HTML attribute: `orientation`. The default is `horizontal`.
     */
    orientation: Orientation;

    /**
     * Whether it is read only: the arrow keys move the focus between its radios, and the user can't check them. Its radios are read only too.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;

    /**
     * Whether one of its radios must be checked for its form to be valid. With no radio checked by default, the user has to choose one.
     *
     * @remarks
     * HTML attribute: `required`.
     */
    required: boolean;

    /**
     * The value of the checked radio, or `null` when none is. Setting it checks the radio with that value.
     */
    value: string | null;
}
