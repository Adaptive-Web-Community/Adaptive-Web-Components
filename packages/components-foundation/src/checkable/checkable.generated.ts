/* eslint-disable */
// This file is generated from src/checkable/checkable.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Slot names of Checkable.
 *
 * @public
 */
export const CheckableSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",
} as const;

/**
 * A control that is checked or not, as a native checkbox or radio is: a checkbox, a switch, or a radio. The host is the form control through `ElementInternals`.
 *
 * @remarks
 * When it is checked, its form data is its `name` with its `value`.
 *
 * Custom states: `checked`, `readonly` when it is read only, `disabled` when its group disables it, and `active` while Space is held.
 *
 * Events: `input` and then `change`, both bubbling, when the user checks or unchecks it.
 *
 * @public
 */
export interface CheckableContract extends LabelledContract {
    /**
     * Whether it is checked now. Not an attribute: the `checked` attribute is whether it is checked by default, before the user or code checks or unchecks it and when its form is reset.
     */
    checked: boolean;

    /**
     * Whether it is disabled. A disabled `<fieldset>` also disables it, which this doesn't reflect: select `:disabled`.
     */
    disabled: boolean;

    /**
     * The name of its value in the form data.
     */
    name: string | null;

    /**
     * Its value in the form data when it is checked. The default is `on`, as a native checkbox's is.
     */
    value: string;
}
