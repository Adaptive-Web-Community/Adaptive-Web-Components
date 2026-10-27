import { CheckableController, type CheckableInternals } from "../checkable/checkable.controller.js";
import type { RadioElement } from "./radio.js";

/**
 * The behavior of a {@link RadioElement}: a {@link CheckableController} with the `radio` role, which a click or Space only checks, and read
 * only when its group is.
 *
 * @remarks
 * The binding calls {@link CheckableController.stateChanged} when `groupReadOnly` changes too.
 *
 * @public
 */
export class RadioController extends CheckableController<RadioElement> {
    constructor(host: RadioElement, internals: CheckableInternals) {
        super(host, internals, "radio");
    }

    protected activate(): boolean {
        if (this.host.checked) {
            return false;
        }

        this.host.checked = true;
        return true;
    }

    protected readOnly(): boolean {
        return this.host.groupReadOnly;
    }
}
