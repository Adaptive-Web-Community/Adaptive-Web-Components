import type { CheckableElement } from "../checkable/checkable.js";

/**
 * The parts of a {@link CheckboxElement}.
 *
 * @public
 */
export const CheckboxParts = {
    /** The box, with the checked and indeterminate indicators. */
    control: "control",

    /** The label, the content of the default slot. */
    label: "label",
} as const;

/**
 * A checkbox (`role="checkbox"`): a {@link CheckableElement} that the user checks and unchecks, and that can be indeterminate.
 *
 * @remarks
 * Slots: the default slot for the label, and `checked-indicator` and `indeterminate-indicator`.
 *
 * Custom states: `checked`, `indeterminate`, `readonly`, and `active` while Space is held.
 *
 * @public
 */
export interface CheckboxElement extends CheckableElement {
    /**
     * Whether it is shown as neither checked nor unchecked (`aria-checked="mixed"`), such as for a checkbox of a group whose items are only
     * partly checked. The user checking or unchecking it ends it.
     *
     * @remarks
     * Not an attribute, as for a native checkbox.
     */
    indeterminate: boolean;

    /**
     * Whether it must be checked for its form to be valid.
     *
     * @remarks
     * HTML attribute: `required`.
     */
    required: boolean;

    /**
     * Whether it is read only: it takes focus, and the user can't check or uncheck it. A read only checkbox isn't validated, as a read only
     * native input isn't.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;
}
