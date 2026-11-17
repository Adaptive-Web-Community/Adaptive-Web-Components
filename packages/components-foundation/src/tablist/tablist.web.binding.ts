import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { tablistDocumentation } from "./tablist.documentation.js";

/**
 * Web platform selectors and style hooks for {@link tablistDocumentation}.
 *
 * @public
 */
export const tablistWebBinding = {
    conditionSelectors: {
        orientation: {
            horizontal: "[orientation='horizontal'], :not([orientation])",
            vertical: "[orientation='vertical']",
        },
    },
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof tablistDocumentation>;
