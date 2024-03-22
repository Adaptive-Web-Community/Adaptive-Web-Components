import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
// import { sliderTemplate } from "@microsoft/fast-foundation";
import { FASTSlider, staticallyCompose } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const SliderConditions = {
    horizontal: "[orientation='horizontal']",
    vertical: "[orientation='vertical']",
};

/**
 * @public
 */
export const SliderParts = {
    positioningRegion: "positioning-region",
    track: "track",
    trackStart: "track-start",
    thumbContainer: "thumb-container",
    thumb: "thumb",
};

/**
 * @public
 */
export const SliderAnatomy: ComponentAnatomy<typeof SliderConditions, typeof SliderParts> = {
    interactivity: Interactivity.never,
    conditions: SliderConditions,
    parts: SliderParts,
    focus: Focus.contextFocused(),
};

// TODO: Temporary copy of template until https://github.com/microsoft/fast/pull/6286/

/**
 * Default Slider template, {@link @microsoft/fast-foundation#sliderTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTSlider> =
    (ds: DesignSystem) =>
        html<FASTSlider>`
            <template
                role="slider"
                tabindex="${x => (x.disabled ? null : 0)}"
                aria-valuetext="${x => x.valueTextFormatter(x.value)}"
                aria-valuenow="${x => x.value}"
                aria-valuemin="${x => x.min}"
                aria-valuemax="${x => x.max}"
                aria-disabled="${x => (x.disabled ? true : void 0)}"
                aria-readonly="${x => (x.readOnly ? true : void 0)}"
                aria-orientation="${x => x.orientation}"
            >
                <div part="positioning-region" class="positioning-region">
                    <div ${ref("track")} part="track" class="track">
                        <slot name="track"></slot>
                        <div part="track-start" class="track-start" style="${x => x.position}">
                            <slot name="track-start"></slot>
                        </div>
                    </div>
                    <slot></slot>
                    <div ${ref("thumb")} part="thumb-container" class="thumb-container" style="${x => x.position}">
                        <slot name="thumb">
                            ${staticallyCompose(`<div class="thumb" part="thumb"></div>`)}
                        </slot>
                    </div>
                </div>
            </template>
        `
        // sliderTemplate();
