/* eslint-disable */
// This file is generated from src/number-field/number-field.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { TextInputContract } from "../text-input/text-input.generated.js";

/**
 * Part names of Number Field for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const NumberFieldParts = {
    /** The `label` slot or `label` attribute text in a `<label for>` that names the control. */
    label: "label",

    /** The box around the control, the step buttons, and the `start` and `end` slots. */
    root: "root",

    /** The native `<input type="number">`; receives DOM focus and shows the text cursor. */
    control: "control",

    /** The step buttons, hidden from assistive technology since the arrow keys step. */
    controls: "controls",

    /** The button that steps up. */
    stepUp: "step-up",

    /** The button that steps down. */
    stepDown: "step-down",
} as const;

/**
 * Slot names of Number Field.
 *
 * @public
 */
export const NumberFieldSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Optional content before the control, commonly an icon. */
    start: "start",

    /** Optional content after the control, commonly an icon or affordance. */
    end: "end",

    /** Replaces the glyph of the button that steps up. */
    stepUpGlyph: "step-up-glyph",

    /** Replaces the glyph of the button that steps down. */
    stepDownGlyph: "step-down-glyph",
} as const;

/**
 * A **Number Field** is a field that the user types a number in. It is a text input around a native `<input type="number">`, which parses the number, steps it with the arrow keys, and validates its range and step. Its step buttons are for the pointer, not the tab order, since the arrow keys step.
 *
 * @public
 */
export interface NumberFieldContract extends TextInputContract {
    /**
     * The least valid value.
     */
    min: number | null;

    /**
     * The greatest valid value.
     */
    max: number | null;

    /**
     * The step between valid values, from `min`. The default is 1, as a native number input's.
     */
    step: number | null;

    /**
     * Whether the step buttons are hidden.
     */
    hideStep: boolean;
}
