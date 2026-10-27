import { type TextControl, TextInputController, type TextInputInternals } from "../text-input/text-input.controller.js";
import type { NumberFieldElement } from "./number-field.js";

/**
 * The behavior of a {@link NumberFieldElement}: a {@link TextInputController} on an `<input type="number">`, with its range and step, and
 * stepping by the step buttons.
 *
 * @public
 */
export class NumberFieldController extends TextInputController<NumberFieldElement> {
    constructor(host: NumberFieldElement, internals: TextInputInternals) {
        super(host, internals, { implicitSubmission: true });
    }

    /**
     * Steps the value up, as the user does, unless the field is read only or disabled.
     */
    public stepUp(): void {
        this.stepBy(control => control.stepUp());
    }

    /**
     * Steps the value down, as the user does, unless the field is read only or disabled.
     */
    public stepDown(): void {
        this.stepBy(control => control.stepDown());
    }

    protected sync(control: TextControl): void {
        super.sync(control);
        this.setControlAttribute(control, "type", "number");
        this.setControlAttribute(control, "min", this.host.min);
        this.setControlAttribute(control, "max", this.host.max);
        this.setControlAttribute(control, "step", this.host.step);
    }

    private stepBy(step: (control: HTMLInputElement) => void): void {
        const { control } = this;
        if (!(control instanceof HTMLInputElement) || control.readOnly || control.disabled) {
            return;
        }

        // The native input steps from its value, its min, and its step, and stays in its range.
        step(control);
        this.setValueAsUser(control.value);
    }
}
