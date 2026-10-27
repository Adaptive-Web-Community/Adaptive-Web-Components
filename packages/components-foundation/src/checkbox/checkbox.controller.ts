import { CheckableController, type CheckableInternals } from "../checkable/checkable.controller.js";
import type { CheckboxElement } from "./checkbox.js";

/**
 * The behavior of a {@link CheckboxElement}: a {@link CheckableController} with the `checkbox` role, the indeterminate state, which the
 * user checking or unchecking ends, `required`, and read only.
 *
 * @remarks
 * The binding calls {@link CheckableController.stateChanged} when `indeterminate`, `required`, or `readOnly` changes too.
 *
 * @public
 */
export class CheckboxController extends CheckableController<CheckboxElement> {
    constructor(host: CheckboxElement, internals: CheckableInternals) {
        super(host, internals, "checkbox");
    }

    public stateChanged(): void {
        super.stateChanged();
        if (this.host.indeterminate) {
            this.internals.states.add("indeterminate");
        } else {
            this.internals.states.delete("indeterminate");
        }
    }

    protected activate(): boolean {
        this.host.indeterminate = false;
        return super.activate();
    }

    protected ariaChecked(): string {
        return this.host.indeterminate ? "mixed" : super.ariaChecked();
    }

    protected required(): boolean {
        return this.host.required;
    }

    protected readOnly(): boolean {
        return this.host.readOnly;
    }
}
