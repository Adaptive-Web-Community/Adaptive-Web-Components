import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { progressDocumentation } from "./progress.documentation.js";

/**
 * Web platform selectors and style hooks for {@link progressDocumentation}.
 *
 * @public
 */
export const progressWebBinding = {
    conditionSelectors: {},
    partSelectors: {
        determinate: ".determinate",
        indeterminate: ".indeterminate",
        indicator: ".indicator",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof progressDocumentation>;
