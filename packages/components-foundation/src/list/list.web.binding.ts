import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { listDocumentation } from "./list.documentation.js";

/**
 * Web platform selectors and style hooks for {@link listDocumentation}.
 *
 * @public
 */
export const listWebBinding = {
    conditionSelectors: {
        orientation: {
            horizontal: "[orientation='horizontal']",
            vertical: "[orientation='vertical'], :not([orientation])",
        },
    },
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof listDocumentation>;
