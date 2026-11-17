import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { labelledWebConditionSelectors } from "../utilities/labelled.web.binding.js";
import { sliderDocumentation } from "./slider.documentation.js";

/**
 * Web platform selectors and style hooks for {@link sliderDocumentation}.
 *
 * @public
 */
export const sliderWebBinding = {
    conditionSelectors: {
        ...labelledWebConditionSelectors,
        orientation: {
            horizontal: "[orientation='horizontal'], :not([orientation])",
            vertical: "[orientation='vertical']",
        },
        readOnly: "[readonly]",
        disabled: ":disabled",
    },
    partSelectors: {
        label: ".label",
        positioningRegion: ".positioning-region",
        track: ".track",
        trackStart: ".track-start",
        thumbContainer: ".thumb-container",
        thumb: ".thumb",
    },
    interactivity: {
        interactive: ":not(:disabled, :state(disabled))",
        disabled: ":is(:disabled, :state(disabled))",
        active: ":is(:active, :state(active))",
    },
    focus: Focus.contextFocused(),
} satisfies PlatformBindingFor<typeof sliderDocumentation>;
