/**
 * The parts of a {@link ProgressElement} that is a ring. A ring is a progress, with the contract and the behavior of `ProgressElement`.
 *
 * @public
 */
export const ProgressRingParts = {
    /** The container of the indicator when the value is known. */
    determinate: "determinate",

    /** The container of the indicator when the value isn't known. */
    indeterminate: "indeterminate",

    /** The arc that shows the progress. */
    indicator: "indicator",

    /** The circle behind the indicator. */
    background: "background",
} as const;
