import { CheckableController, type CheckableInternals } from "../checkable/checkable.controller.js";
import type { SwitchElement } from "./switch.js";

/**
 * The behavior of a {@link SwitchElement}: a {@link CheckableController} with the `switch` role, and `required`.
 *
 * @remarks
 * The binding calls {@link CheckableController.stateChanged} when `required` changes too.
 *
 * @public
 */
export class SwitchController extends CheckableController<SwitchElement> {
    constructor(host: SwitchElement, internals: CheckableInternals) {
        super(host, internals, "switch");
    }

    protected required(): boolean {
        return this.host.required;
    }
}
