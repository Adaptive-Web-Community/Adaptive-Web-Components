import { type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { radioGroupDocumentation } from "./radio-group.documentation.js";

/**
 * Web platform selectors and style hooks for {@link radioGroupDocumentation}.
 *
 * @public
 */
export const radioGroupWebBinding = {
    conditionSelectors: {
        hideLabel: "[hide-label]",
        orientation: {
            horizontal: ":is(:not([orientation]), [orientation='horizontal'])",
            vertical: "[orientation='vertical']",
        },
        readOnly: "[readonly]",
        disabled: ":disabled",
        required: "[required]",
    },
    partSelectors: {
        label: ".label",
        positioningRegion: ".positioning-region",
    },
    interactivity: {
        disabled: ":disabled",
    },
} satisfies PlatformBindingFor<typeof radioGroupDocumentation>;
