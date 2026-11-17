/* eslint-disable */
// This file is generated from src/slider-label/slider-label.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Slider Label for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const SliderLabelParts = {
    /** Holds the mark and content, positioned along the track. */
    container: "container",

    /** The mark on the track, hidden when `hideMark` is set. */
    mark: "mark",

    /** The default slot label text. */
    content: "content",
} as const;

/**
 * Slot names of Slider Label.
 *
 * @public
 */
export const SliderLabelSlots = {
    /** The label text. */
    default: "",
} as const;

/**
 * The direction of its slider's track, set by the slider.
 *
 * @public
 */
export const SliderLabelOrientation = {
    /** Labels along a horizontal track. */
    horizontal: "horizontal",

    /** Labels along a vertical track. */
    vertical: "vertical",
} as const;

/** @public */
export type SliderLabelOrientation = (typeof SliderLabelOrientation)[keyof typeof SliderLabelOrientation];

/**
 * A **Slider Label** marks a value along a slider track, with an optional mark. Its slider gives where it is and its orientation.
 *
 * @public
 */
export interface SliderLabelContract {
    /**
     * The value along the slider range that this label describes.
     */
    position: number;

    /**
     * Whether the mark on the track is hidden.
     */
    hideMark: boolean;

    /**
     * The direction of its slider's track, set by the slider.
     */
    orientation: SliderLabelOrientation;
}
