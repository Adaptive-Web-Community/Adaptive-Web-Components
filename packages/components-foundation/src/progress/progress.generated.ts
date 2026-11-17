/* eslint-disable */
// This file is generated from src/progress/progress.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Progress for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const ProgressParts = {
    /** Shown when `value` is known; holds the `determinate` slot and the default indicator. */
    determinate: "determinate",

    /** Shown when `value` is not known; holds the `indeterminate` slot and the default indicator. */
    indeterminate: "indeterminate",

    /** What shows the progress inside the visible container part. */
    indicator: "indicator",
} as const;

/**
 * Slot names of Progress.
 *
 * @public
 */
export const ProgressSlots = {
    /** Replaces the default indicator when progress is determinate. */
    determinate: "determinate",

    /** Replaces the default indicator when progress is indeterminate. */
    indeterminate: "indeterminate",
} as const;

/**
 * A **Progress** indicator shows how much of a task is done (`role="progressbar"`), between a minimum and maximum, or that work is ongoing when the value is not known.
 *
 * @public
 */
export interface ProgressContract {
    /**
     * How much is done, or no value when progress is not known (indeterminate). Not styled as a condition.
     */
    value: number | null;

    /**
     * The value at which nothing is done. The default is 0.
     */
    min: number;

    /**
     * The value at which all is done. The default is 100.
     */
    max: number;
}
