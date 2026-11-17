/* eslint-disable */
// This file is generated from src/progress-ring/progress-ring.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { ProgressContract } from "../progress/progress.generated.js";

/**
 * Part names of Progress Ring for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const ProgressRingParts = {
    /** Shown when `value` is known; holds the `determinate` slot and the default ring indicator. */
    determinate: "determinate",

    /** Shown when `value` is not known; holds the `indeterminate` slot and the default ring indicator. */
    indeterminate: "indeterminate",

    /** The arc that shows progress inside the visible container part. */
    indicator: "indicator",

    /** The circle behind the indicator arc in the default ring. */
    background: "background",
} as const;

/**
 * Slot names of Progress Ring.
 *
 * @public
 */
export const ProgressRingSlots = {
    /** Replaces the default indicator when progress is determinate. */
    determinate: "determinate",

    /** Replaces the default indicator when progress is indeterminate. */
    indeterminate: "indeterminate",
} as const;

/**
 * A **Progress Ring** is a circular progress indicator. It has the same range and value contract as a progress bar; the ring adds a background arc behind the indicator.
 *
 * @public
 */
export interface ProgressRingContract extends ProgressContract {
}
