import type { CheckableElement } from "../checkable/checkable.js";
import type { SwitchContract } from "./switch.generated.js";

/**
 * A switch (`role="switch"`): a {@link CheckableElement} that turns something on and off.
 *
 * @remarks
 * Slots: `label`, and `switch` for a track of the author's.
 *
 * Custom states: `checked`, `readonly`, and `active` while Space is held.
 *
 * @public
 */
export interface SwitchElement extends CheckableElement, SwitchContract {}
