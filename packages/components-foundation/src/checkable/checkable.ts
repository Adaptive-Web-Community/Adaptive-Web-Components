import type { FormControlElement } from "../utilities/form-control.js";
import type { LabelledElement } from "../utilities/label.js";

/**
 * A control that is checked or not, as a native checkbox or radio is: a checkbox, a switch, or a radio. It is the host element, with its role
 * and its form association through `ElementInternals` (see `docs/decisions/0010-a-control-is-its-host-element.md`).
 *
 * @remarks
 * When it is checked, its form data is its {@link CheckableElement.name} with its {@link CheckableElement.value}.
 *
 * Slots: `label`, its label (see {@link LabelledElement}), which names it as its content.
 *
 * Custom states: `checked`, `readonly` when it is read only, `disabled` when its group disables it, and `active` while Space is held.
 *
 * Events: `input` and then `change`, both bubbling, when the user checks or unchecks it.
 *
 * @public
 */
export interface CheckableElement extends FormControlElement, LabelledElement {
    /**
     * Whether it is checked now.
     *
     * @remarks
     * Not an attribute: the `checked` attribute is {@link CheckableElement.defaultChecked}.
     */
    checked: boolean;

    /**
     * Whether it is checked by default: before the user or code checks or unchecks it, and when its form is reset.
     *
     * @remarks
     * HTML attribute: `checked`.
     */
    defaultChecked: boolean;

    /**
     * Whether it is disabled. A disabled `<fieldset>` also disables it, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * The name of its value in the form data.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * Its value in the form data, when it is checked.
     *
     * @remarks
     * HTML attribute: `value`. The default is `on`, as a native checkbox's is.
     */
    value: string;
}

/**
 * The role of a {@link CheckableElement}.
 *
 * @public
 */
export type CheckableRole = "checkbox" | "switch" | "radio";
