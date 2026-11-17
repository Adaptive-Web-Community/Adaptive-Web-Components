/* eslint-disable */
// This file is generated from src/checkbox/checkbox.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { CheckableContract } from "../checkable/checkable.generated.js";

/**
 * Part names of Checkbox for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const CheckboxParts = {
    /** The box, with the checked and indeterminate indicators. */
    control: "control",

    /** The `label` slot or `label` attribute text that names the checkbox. */
    label: "label",
} as const;

/**
 * Slot names of Checkbox.
 *
 * @public
 */
export const CheckboxSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Replaces the default checked glyph in the control part. */
    checkedIndicator: "checked-indicator",

    /** Replaces the default indeterminate glyph in the control part. */
    indeterminateIndicator: "indeterminate-indicator",
} as const;

/**
 * A **Checkbox** is a control the user checks and unchecks, which can be indeterminate. The host is the checkbox (`role="checkbox"`) and the form control through `ElementInternals`.
 *
 * @public
 */
export interface CheckboxContract extends CheckableContract {
    /**
     * Whether it is shown as neither checked nor unchecked (`aria-checked="mixed"`). Not an attribute, as for a native checkbox.
     */
    indeterminate: boolean;

    /**
     * Whether it must be checked for its form to be valid.
     */
    required: boolean;

    /**
     * Whether it is read only: it takes focus, and the user can't check or uncheck it. It isn't validated, as a read only native input isn't.
     */
    readOnly: boolean;
}
