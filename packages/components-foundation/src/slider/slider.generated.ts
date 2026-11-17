/* eslint-disable */
// This file is generated from src/slider/slider.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Part names of Slider for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const SliderParts = {
    /** The `label` slot or `label` attribute text that names the slider. */
    label: "label",

    /** The region of the track, thumb, and labels, with `--slider-position` from the value. */
    positioningRegion: "positioning-region",

    /** The track. */
    track: "track",

    /** The track from its start to the thumb. */
    trackStart: "track-start",

    /** The container of the thumb at the value. */
    thumbContainer: "thumb-container",

    /** The thumb. */
    thumb: "thumb",
} as const;

/**
 * Slot names of Slider.
 *
 * @public
 */
export const SliderSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Replaces the default track. */
    track: "track",

    /** Replaces the default filled portion of the track. */
    trackStart: "track-start",

    /** Replaces the default thumb. */
    thumb: "thumb",

    /** Slider labels along the track. */
    default: "",
} as const;

/**
 * The direction of the track.
 *
 * @public
 */
export const SliderOrientation = {
    /** The track runs horizontally. */
    horizontal: "horizontal",

    /** The track runs vertically. */
    vertical: "vertical",
} as const;

/** @public */
export type SliderOrientation = (typeof SliderOrientation)[keyof typeof SliderOrientation];

/**
 * A **Slider** is a value in a range (`role="slider"`), which the user changes with the arrows or by dragging the thumb, as a native `<input type="range">`.
 *
 * @public
 */
export interface SliderContract extends LabelledContract {
    /**
     * The name of its value in the form data.
     */
    name: string | null;

    /**
     * The value now. Not an attribute: the `value` attribute is the value by default, before the user or code changes it and when its form is reset.
     */
    value: string;

    /**
     * The lowest value. The default is 0.
     */
    min: number;

    /**
     * The highest value. The default is 100.
     */
    max: number;

    /**
     * The step between values, from `min`. The default is 1.
     */
    step: number;

    /**
     * The direction of the track.
     */
    orientation: SliderOrientation;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: it takes focus, and the user can't change the value.
     */
    readOnly: boolean;
}
