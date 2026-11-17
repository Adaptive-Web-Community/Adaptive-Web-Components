import type { TextInputElement } from "../text-input/text-input.js";
import type { NumberFieldContract } from "./number-field.generated.js";

/**
 * A number field: a {@link TextInputElement} around a native `<input type="number">`, which parses the number, steps it with the arrow
 * keys, and validates its range and step. Its step buttons are for the pointer, not the tab order, since the arrow keys step.
 *
 * @remarks
 * Slots: `label`, `start` and `end` around the control, and `step-up-glyph` and `step-down-glyph`.
 *
 * @public
 */
export interface NumberFieldElement extends TextInputElement, NumberFieldContract {
    /**
     * Steps the value up, as the user does with the step button: it emits `input` and `change`.
     */
    stepUp(): void;

    /**
     * Steps the value down, as the user does with the step button: it emits `input` and `change`.
     */
    stepDown(): void;
}
