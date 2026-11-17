import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { dividerDocumentation } from "./divider.documentation.js";

/**
 * Web platform selectors and style hooks for {@link dividerDocumentation}.
 *
 * @public
 */
export const dividerWebBinding = {
    conditionSelectors: {
        orientation: {
            horizontal: "[orientation='horizontal'], :not([orientation])",
            vertical: "[orientation='vertical']",
        },
    },
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof dividerDocumentation>;
