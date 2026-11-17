import type { FormControlElement } from "../utilities/form-control.js";
import type { CheckableContract } from "./checkable.generated.js";

/**
 * A control that is checked or not, as a native checkbox or radio is: a checkbox, a switch, or a radio. It is the host element, with its role
 * and its form association through `ElementInternals` (see `docs/decisions/0010-a-control-is-its-host-element.md`).
 *
 * @remarks
 * When it is checked, its form data is its {@link CheckableElement.name} with its {@link CheckableElement.value}.
 *
 * Slots: `label`, its label (see the `labelled` contract), which names it as its content.
 *
 * Custom states: `checked`, `readonly` when it is read only, `disabled` when its group disables it, and `active` while Space is held.
 *
 * Events: `input` and then `change`, both bubbling, when the user checks or unchecks it.
 *
 * @public
 */
export interface CheckableElement extends FormControlElement, CheckableContract {
    /**
     * Whether it is checked by default: before the user or code checks or unchecks it, and when its form is reset.
     *
     * @remarks
     * HTML attribute: `checked`.
     */
    defaultChecked: boolean;
}

/**
 * The role of a {@link CheckableElement}.
 *
 * @public
 */
export type CheckableRole = "checkbox" | "switch" | "radio";
