import type { CheckableElement } from "../checkable/checkable.js";
import type { RadioContract } from "./radio.generated.js";

/**
 * A radio (`role="radio"`): a {@link CheckableElement} of a radio group, of which one is checked. The user checks it, and unchecks it only
 * by checking another; the radio group does that, and the keyboard between its radios.
 *
 * @remarks
 * Slots: `label`, and `checked-indicator`.
 *
 * Custom states: `checked`, `readonly` when its group is read only, `disabled` when its group is disabled, and `active` while Space is
 * held.
 *
 * @public
 */
export interface RadioElement extends CheckableElement, RadioContract {}
