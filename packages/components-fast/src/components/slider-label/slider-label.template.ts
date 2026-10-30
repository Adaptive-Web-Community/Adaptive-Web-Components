import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { SliderLabelParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { SliderLabel } from "./slider-label.js";

/**
 * @public
 */
export const SliderLabelConditions = {
    orientation: {
        horizontal: ":not(:state(vertical))",
        vertical: ":state(vertical)",
    },
};

export { SliderLabelParts };

/**
 * @public
 */
export const SliderLabelAnatomy: ComponentAnatomy<typeof SliderLabelConditions, typeof SliderLabelParts> = {
    interactivity: Interactivity.never,
    conditions: SliderLabelConditions,
    parts: SliderLabelParts,
};

/**
 * Default Slider Label template: the mark and the content, placed by the `--slider-label-position` custom property.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<SliderLabel> =
    (ds: DesignSystem) => html<SliderLabel>`
        <div class="container" part="container" style="--slider-label-position: ${x => x.percent}">
            <div class="mark" part="mark" ?hidden="${x => x.hideMark}"></div>
            <span class="content" part="content">
                <slot></slot>
            </span>
        </div>
    `;
