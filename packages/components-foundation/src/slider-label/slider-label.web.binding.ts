import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { sliderLabelDocumentation } from "./slider-label.documentation.js";

/**
 * Web platform selectors and style hooks for {@link sliderLabelDocumentation}.
 *
 * @public
 */
export const sliderLabelWebBinding = {
    conditionSelectors: {
        orientation: {
            horizontal: ":not(:state(vertical))",
            vertical: ":state(vertical)",
        },
        hideMark: "[hide-mark]",
    },
    partSelectors: {
        container: ".container",
        mark: ".mark",
        content: ".content",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof sliderLabelDocumentation>;
