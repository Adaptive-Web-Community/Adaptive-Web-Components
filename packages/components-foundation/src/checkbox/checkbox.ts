import type { CheckableElement } from "../checkable/checkable.js";
import type { CheckboxContract } from "./checkbox.generated.js";

/**
 * A checkbox (`role="checkbox"`): a {@link CheckableElement} that the user checks and unchecks, and that can be indeterminate.
 *
 * @remarks
 * Slots: `label`, and `checked-indicator` and `indeterminate-indicator`.
 *
 * Custom states: `checked`, `indeterminate`, `readonly`, and `active` while Space is held.
 *
 * @public
 */
export interface CheckboxElement extends CheckableElement, CheckboxContract {}
