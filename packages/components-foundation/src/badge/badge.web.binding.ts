import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { badgeDocumentation } from "./badge.documentation.js";

/**
 * Web platform selectors and style hooks for {@link badgeDocumentation}.
 *
 * @public
 */
export const badgeWebBinding = {
    conditionSelectors: {},
    partSelectors: {
        content: ".content",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof badgeDocumentation>;
