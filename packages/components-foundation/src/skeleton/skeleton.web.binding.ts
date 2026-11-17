import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { skeletonDocumentation } from "./skeleton.documentation.js";

/**
 * Web platform selectors and style hooks for {@link skeletonDocumentation}.
 *
 * @public
 */
export const skeletonWebBinding = {
    conditionSelectors: {
        shape: {
            rect: "[shape='rect'], :not([shape])",
            circle: "[shape='circle']",
        },
        shimmer: "[shimmer]",
    },
    partSelectors: {
        shimmer: ".shimmer",
        pattern: ".pattern",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof skeletonDocumentation>;
