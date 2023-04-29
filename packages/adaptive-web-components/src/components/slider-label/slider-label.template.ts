import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
// import { sliderLabelTemplate } from "@microsoft/fast-foundation";
import type { FASTSliderLabel } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const SliderLabelConditions = {
    horizontal: "[orientation='horizontal']",
    vertical: "[orientation='vertical']",
};

export const SliderLabelParts = {
    container: "container",
    mark: "mark",
    content: "content",
};

export const SliderLabelAnatomy: ComponentAnatomy<typeof SliderLabelConditions, typeof SliderLabelParts> = {
    interactivity: Interactivity.never,
    conditions: SliderLabelConditions,
    parts: SliderLabelParts,
};

// TODO: Temporary copy of template until https://github.com/microsoft/fast/pull/6286/

/**
 * Default Slider Label template, {@link @microsoft/fast-foundation#sliderLabelTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSliderLabel> =
    (ds: DesignSystem) =>
        html<FASTSliderLabel>`
            <template aria-disabled="${x => x.disabled}">
                <div part="container" class="container" style="${(x) => x.positionStyle}">
                    ${when(
                        (x) => !x.hideMark,
                        html`
                            <div class="mark" part="mark"></div>
                        `
                    )}
                    <span class="content" part="content">
                        <slot></slot>
                    </span>
                </div>
            </template>
        `

        // sliderLabelTemplate();
