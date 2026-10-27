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
 * Custom states: `checked`, `readonly` when its group is read only, `disabled` when its group is disabled, and `active` while Space is
 * held.
 *
 * @public
 */
export interface RadioElement extends CheckableElement {
    /**
     * Whether its radio group is read only, which makes it read only: it takes focus, and the user can't check it.
     *
     * @remarks
     * Set by the radio group. The default is `false`.
     */
    groupReadOnly: boolean;

    /**
     * Whether its radio group is disabled, which disables it: it doesn't take focus, the user can't check it, and it gives no value.
     *
     * @remarks
     * Set by the radio group, so the radio's own `disabled` attribute is the author's. The default is `false`. It shows as `:state(disabled)`,
     * since only the platform's disabled is `:disabled`.
     */
    groupDisabled: boolean;
}
