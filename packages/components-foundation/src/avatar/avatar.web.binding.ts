import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { avatarDocumentation } from "./avatar.documentation.js";

/**
 * Web platform selectors and style hooks for {@link avatarDocumentation}.
 *
 * @public
 */
export const avatarWebBinding = {
    conditionSelectors: {},
    partSelectors: {
        backplate: ".backplate",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof avatarDocumentation>;
