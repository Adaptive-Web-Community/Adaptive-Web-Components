import type { DefaultAria } from "../utilities/aria.js";

/**
 * The parts of a {@link ProgressElement} that is a bar.
 *
 * @public
 */
export const ProgressParts = {
    /** The container of the indicator when the value is known. */
    determinate: "determinate",

    /** The container of the indicator when the value isn't known. */
    indeterminate: "indeterminate",

    /** What shows the progress. */
    indicator: "indicator",
} as const;

/**
 * A progress indicator (`role="progressbar"`): how much of a task is done, between {@link ProgressElement.min} and
 * {@link ProgressElement.max}, or that it is going on when its {@link ProgressElement.value} isn't known. A progress bar and a progress ring
 * are both one.
 *
 * @remarks
 * An indeterminate progress has no value for assistive technology, so the author names it (`aria-label`), as for any progress.
 *
 * Slots: `determinate` and `indeterminate`, for an indicator of the author's.
 *
 * @public
 */
export interface ProgressElement extends HTMLElement {
    /**
     * How much is done, or `null` when it isn't known (indeterminate).
     *
     * @remarks
     * HTML attribute: `value`. A value outside {@link ProgressElement.min} and {@link ProgressElement.max} is shown and reported at the nearest
     * of the two, and the property keeps the author's value.
     */
    value: number | null;

    /**
     * The value at which nothing is done.
     *
     * @remarks
     * HTML attribute: `min`. The default is 0.
     */
    min: number;

    /**
     * The value at which all is done.
     *
     * @remarks
     * HTML attribute: `max`. The default is 100.
     */
    max: number;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * How much of a progress is done, from 0 to 100, or `null` when it is indeterminate.
 *
 * @public
 */
export function progressPercent(progress: ProgressElement): number | null {
    const { value, min, max } = progress;
    if (value === null || Number.isNaN(value)) {
        return null;
    }

    const range = max - min;
    return range > 0 ? clamp(((value - min) / range) * 100, 0, 100) : 0;
}

/**
 * The default ARIA of a progress: the `progressbar` role, with its range, and its value when it is known.
 *
 * @public
 */
export function progressAria(progress: ProgressElement): DefaultAria {
    const { value, min, max } = progress;

    return {
        role: "progressbar",
        ariaValueMin: `${min}`,
        ariaValueMax: `${max}`,
        ariaValueNow: value === null || Number.isNaN(value) ? null : `${clamp(value, min, max)}`,
    };
}
