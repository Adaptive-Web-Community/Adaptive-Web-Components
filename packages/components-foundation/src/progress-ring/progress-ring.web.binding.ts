import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { progressRingDocumentation } from "./progress-ring.documentation.js";

/**
 * Web platform selectors and style hooks for {@link progressRingDocumentation}.
 *
 * @public
 */
export const progressRingWebBinding = {
    conditionSelectors: {},
    partSelectors: {
        determinate: ".determinate",
        indeterminate: ".indeterminate",
        indicator: ".indicator",
        background: ".background",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof progressRingDocumentation>;
