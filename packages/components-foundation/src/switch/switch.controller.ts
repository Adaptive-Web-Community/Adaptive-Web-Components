import { CheckableController, type CheckableInternals } from "../checkable/checkable.controller.js";
import type { SwitchElement } from "./switch.js";

/**
 * The behavior of a {@link SwitchElement}: a {@link CheckableController} with the `switch` role, `required`, and read only.
 *
 * @remarks
 * The binding calls {@link CheckableController.stateChanged} when `required` or `readOnly` changes too.
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

    protected readOnly(): boolean {
        return this.host.readOnly;
    }
}
