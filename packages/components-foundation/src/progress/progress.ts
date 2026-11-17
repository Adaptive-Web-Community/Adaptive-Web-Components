import type { DefaultAria } from "../utilities/aria.js";
import type { ProgressContract } from "./progress.generated.js";

/**
 * A progress indicator (`role="progressbar"`): how much of a task is done, between {@link ProgressElement.min} and
 * {@link ProgressElement.max}, or that it is going on when its {@link ProgressElement.value} isn't known. A progress bar and a progress ring
 * are both one.
 *
 * @remarks
 * Slots: `determinate` and `indeterminate`, for an indicator of the author's.
 *
 * @public
 */
export interface ProgressElement extends HTMLElement, ProgressContract {}

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
