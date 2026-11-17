import type { Orientation } from "../utilities/orientation.js";
import type { SliderLabelContract } from "./slider-label.generated.js";

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
export interface SliderLabelElement extends HTMLElement, SliderLabelContract {
    /**
     * Where it is along the track, from 0 to 100, given by its slider.
     */
    percent: number;

    /**
     * The direction of its slider's track, given by its slider.
     */
    orientation: Orientation;
}
