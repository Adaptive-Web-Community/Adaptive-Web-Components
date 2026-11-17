import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import {
    sliderDocumentation,
    SliderParts,
    sliderPercent,
    SliderSlots,
    sliderWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Slider } from "./slider.js";

/**
 * @public
 */
export const SliderAnatomy = documentationToComponentAnatomy(sliderDocumentation, sliderWebBinding);

/**
 * Default Slider template: the label, which names the slider through its `ElementInternals`, and the track, the slider labels, and the
 * thumb, placed by the `--slider-position` custom property.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Slider> =
    (ds: DesignSystem) => html<Slider>`
        <span class=${(_) => SliderParts.label} part=${(_) => SliderParts.label} aria-hidden="true" ?hidden="${x => !x.label && !x.labelElements.length}" ${ref("labelPart")}>
            <slot name=${(_) => SliderSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div class=${(_) => SliderParts.positioningRegion} part=${(_) => SliderParts.positioningRegion} style="--slider-position: ${x => x.percent}">
            <div class=${(_) => SliderParts.track} part=${(_) => SliderParts.track} ${ref("track")}>
                <slot name=${(_) => SliderSlots.track}></slot>
                <div class=${(_) => SliderParts.trackStart} part=${(_) => SliderParts.trackStart}>
                    <slot name=${(_) => SliderSlots.trackStart}></slot>
                </div>
            </div>
            <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            <div class=${(_) => SliderParts.thumbContainer} part=${(_) => SliderParts.thumbContainer}>
                <slot name=${(_) => SliderSlots.thumb}>
                    <div class=${(_) => SliderParts.thumb} part=${(_) => SliderParts.thumb}></div>
                </slot>
            </div>
        </div>
    `;
