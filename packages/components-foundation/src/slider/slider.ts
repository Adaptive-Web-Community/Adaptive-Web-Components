import type { FormControlElement } from "../utilities/form-control.js";
import type { SliderContract } from "./slider.generated.js";

/**
 * A slider (`role="slider"`): a value in a range, which the user changes with the arrows or by dragging the thumb, as a native
 * `<input type="range">`. Implements the {@link https://www.w3.org/WAI/ARIA/apg/patterns/slider/ | ARIA slider pattern} with
 * {@link SliderController}.
 *
 * @remarks
 * Slots: `label`, its label (see the `labelled` contract), the default slot for slider labels (the marks along the track), `track`,
 * `track-start`, and `thumb`.
 *
 * Events: `input` while the user changes the value, and `change` when the user is done, as a native range's.
 *
 * @public
 */
export interface SliderElement extends FormControlElement, SliderContract {
    /**
     * The value by default, and when its form is reset. Without it, the middle of the range, as a native range's.
     *
     * @remarks
     * HTML attribute: `value`.
     */
    defaultValue: string | null;

    /**
     * The value as a number.
     */
    readonly valueAsNumber: number;

    /**
     * The text that says the value, for assistive technology (`aria-valuetext`), such as `"50%"`, or `null` for the value itself.
     */
    valueTextFormatter: ((value: string) => string) | null;

    /**
     * Increases the value by a number of steps, 1 by default.
     */
    stepUp(count?: number): void;

    /**
     * Decreases the value by a number of steps, 1 by default.
     */
    stepDown(count?: number): void;
}

/**
 * Where a value is in the range of a slider, from 0 to 100, for the styles.
 *
 * @public
 */
export function sliderPercent(value: number, min: number, max: number): number {
    if (max <= min) {
        return 0;
    }
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}
