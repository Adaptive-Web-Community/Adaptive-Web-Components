import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { SliderParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import type { Slider } from "./slider.js";

/**
 * @public
 */
export const SliderConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
    readOnly: "[readonly]",
};

export { SliderParts };

/**
 * @public
 */
export const SliderAnatomy: ComponentAnatomy<typeof SliderConditions, typeof SliderParts> = {
    interactivity: controlInteractivity,
    conditions: SliderConditions,
    parts: SliderParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Slider template: the track, the labels, and the thumb, placed by the `--slider-position` custom property.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Slider> =
    (ds: DesignSystem) => html<Slider>`
        <div class="positioning-region" part="positioning-region" style="--slider-position: ${x => x.percent}">
            <div class="track" part="track" ${ref("track")}>
                <slot name="track"></slot>
                <div class="track-start" part="track-start">
                    <slot name="track-start"></slot>
                </div>
            </div>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            <div class="thumb-container" part="thumb-container">
                <slot name="thumb">
                    <div class="thumb" part="thumb"></div>
                </slot>
            </div>
        </div>
    `;
