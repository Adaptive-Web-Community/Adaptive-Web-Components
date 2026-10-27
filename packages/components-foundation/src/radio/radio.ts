import type { CheckableElement } from "../checkable/checkable.js";

/**
 * The parts of a {@link RadioElement}.
 *
 * @public
 */
export const RadioParts = {
    /** The circle, with the checked indicator. */
    control: "control",

    /** The label, the content of the default slot. */
    label: "label",
} as const;

/**
 * A radio (`role="radio"`): a {@link CheckableElement} of a radio group, of which one is checked. The user checks it, and unchecks it only
 * by checking another; the radio group does that, and the keyboard between its radios.
 *
 * @remarks
 * Slots: the default slot for the label, and `checked-indicator`.
 *
 * Custom states: `checked`, and `active` while Space is held.
 *
 * @public
 */
export interface RadioElement extends CheckableElement {}
