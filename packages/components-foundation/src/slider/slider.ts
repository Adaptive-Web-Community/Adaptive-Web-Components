import type { FormControlElement } from "../utilities/form-control.js";
import type { Orientation } from "../utilities/orientation.js";
import type { LabelledElement } from "../utilities/label.js";

/**
 * The parts of a {@link SliderElement}.
 *
 * @public
 */
export const SliderParts = {
    /** The label: the `label` slot, or the text of the `label` attribute. */
    label: "label",

    /** The region of the track, the thumb, and the labels, with the `--slider-position` custom property: the value, from 0 to 100. */
    positioningRegion: "positioning-region",

    /** The track. */
    track: "track",

    /** The track from its start to the thumb. */
    trackStart: "track-start",

    /** The container of the thumb, at the value. */
    thumbContainer: "thumb-container",

    /** The thumb. */
    thumb: "thumb",
} as const;

/**
 * A slider (`role="slider"`): a value in a range, which the user changes with the arrows or by dragging the thumb, as a native
 * `<input type="range">`. Implements the {@link https://www.w3.org/WAI/ARIA/apg/patterns/slider/ | ARIA slider pattern} with
 * {@link SliderController}.
 *
 * @remarks
 * The host is the slider and the form control, and takes focus. Its value is a string, as a native range's, kept in the range and on a
 * step. The `value` attribute is its default value.
 *
 * Slots: `label`, its label (see {@link LabelledElement}), the default slot for slider labels (the marks along the track), `track`,
 * `track-start`, and `thumb`.
 *
 * Events: `input` while the user changes the value, and `change` when the user is done, as a native range's.
 *
 * @public
 */
export interface SliderElement extends FormControlElement, LabelledElement {
    /**
     * The name of its value in the form data.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * The value, in the range and on a step.
     */
    value: string;

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
     * The lowest value.
     *
     * @remarks
     * HTML attribute: `min`. The default is 0, as a native range's.
     */
    min: number;

    /**
     * The highest value.
     *
     * @remarks
     * HTML attribute: `max`. The default is 100, as a native range's.
     */
    max: number;

    /**
     * The step between values, from `min`.
     *
     * @remarks
     * HTML attribute: `step`. The default is 1, as a native range's.
     */
    step: number;

    /**
     * The direction of the track.
     *
     * @remarks
     * HTML attribute: `orientation`. The default is `horizontal`.
     */
    orientation: Orientation;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: it takes focus, and the user can't change the value.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;

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
