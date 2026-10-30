import type { Orientation } from "../utilities/orientation.js";

/**
 * The parts of a {@link SliderLabelElement}.
 *
 * @public
 */
export const SliderLabelParts = {
    /** The container of the mark and the content, with the `--slider-label-position` custom property: where it is, from 0 to 100. */
    container: "container",

    /** The mark on the track. */
    mark: "mark",

    /** The container of the default slot. */
    content: "content",
} as const;

/**
 * A label of a value along a slider's track, with a mark.
 *
 * @remarks
 * Its slider gives it where it is and its orientation. Assistive technology doesn't read it: a slider's content is presentational, and the
 * slider says its value.
 *
 * Slots: the default slot for its text.
 *
 * @public
 */
export interface SliderLabelElement extends HTMLElement {
    /**
     * The value it labels.
     *
     * @remarks
     * HTML attribute: `position`.
     */
    position: number;

    /**
     * Whether its mark is hidden.
     *
     * @remarks
     * HTML attribute: `hide-mark`.
     */
    hideMark: boolean;

    /**
     * Where it is along the track, from 0 to 100, given by its slider.
     */
    percent: number;

    /**
     * The direction of its slider's track, given by its slider.
     */
    orientation: Orientation;
}
