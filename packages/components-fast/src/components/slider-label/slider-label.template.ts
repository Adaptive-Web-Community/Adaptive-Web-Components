import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import {
    sliderLabelDocumentation,
    SliderLabelParts,
    sliderLabelWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { SliderLabel } from "./slider-label.js";

/**
 * @public
 */
export const SliderLabelAnatomy = documentationToComponentAnatomy(sliderLabelDocumentation, sliderLabelWebBinding);

/**
 * Default Slider Label template: the mark and the content, placed by the `--slider-label-position` custom property.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<SliderLabel> =
    (ds: DesignSystem) => html<SliderLabel>`
        <div class=${(_) => SliderLabelParts.container} part=${(_) => SliderLabelParts.container} style="--slider-label-position: ${x => x.percent}">
            <div class=${(_) => SliderLabelParts.mark} part=${(_) => SliderLabelParts.mark} ?hidden="${x => x.hideMark}"></div>
            <span class=${(_) => SliderLabelParts.content} part=${(_) => SliderLabelParts.content}>
                <slot></slot>
            </span>
        </div>
    `;
