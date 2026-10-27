import type { TextInputElement } from "../text-input/text-input.js";

/**
 * The parts of a {@link NumberFieldElement}.
 *
 * @public
 */
export const NumberFieldParts = {
    /** The label, the content of the default slot. */
    label: "label",

    /** The box around the control, the step buttons, and the `start` and `end` slots. */
    root: "root",

    /** The native `<input type="number">`. */
    control: "control",

    /** The step buttons. */
    controls: "controls",

    /** The button that steps up. */
    stepUp: "step-up",

    /** The button that steps down. */
    stepDown: "step-down",
} as const;

/**
 * A number field: a {@link TextInputElement} around a native `<input type="number">`, which parses the number, steps it with the arrow
 * keys, and validates its range and step. Its step buttons are for the pointer, not the tab order, since the arrow keys step.
 *
 * @remarks
 * Slots: the default slot for the label, `start` and `end` around the control, and `step-up-glyph` and `step-down-glyph`.
 *
 * @public
 */
export interface NumberFieldElement extends TextInputElement {
    /**
     * The least valid value.
     *
     * @remarks
     * HTML attribute: `min`.
     */
    min: number | null;

    /**
     * The greatest valid value.
     *
     * @remarks
     * HTML attribute: `max`.
     */
    max: number | null;

    /**
     * The step between valid values, from `min`. The default is 1, as a native number input's.
     *
     * @remarks
     * HTML attribute: `step`.
     */
    step: number | null;

    /**
     * Whether the step buttons are hidden.
     *
     * @remarks
     * HTML attribute: `hide-step`.
     */
    hideStep: boolean;

    /**
     * Steps the value up, as the user does with the step button: it emits `input` and `change`.
     */
    stepUp(): void;

    /**
     * Steps the value down, as the user does with the step button: it emits `input` and `change`.
     */
    stepDown(): void;
}
