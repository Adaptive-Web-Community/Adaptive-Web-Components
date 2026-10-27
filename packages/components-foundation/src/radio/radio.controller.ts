import { CheckableController, type CheckableInternals } from "../checkable/checkable.controller.js";
import type { RadioElement } from "./radio.js";

/**
 * The behavior of a {@link RadioElement}: a {@link CheckableController} with the `radio` role, which a click or Space only checks.
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
}
