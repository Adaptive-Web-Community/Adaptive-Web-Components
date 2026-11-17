import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { toolbarDocumentation } from "./toolbar.documentation.js";

/**
 * Web platform selectors and style hooks for {@link toolbarDocumentation}.
 *
 * @public
 */
export const toolbarWebBinding = {
    conditionSelectors: {
        orientation: {
            horizontal: "[orientation='horizontal'], :not([orientation])",
            vertical: "[orientation='vertical']",
        },
    },
    partSelectors: {
        positioningRegion: ".positioning-region",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof toolbarDocumentation>;
