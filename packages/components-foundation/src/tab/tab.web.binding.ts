import { Focus, Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { tabDocumentation } from "./tab.documentation.js";

/**
 * Web platform selectors and style hooks for {@link tabDocumentation}.
 *
 * @public
 */
export const tabWebBinding = {
    conditionSelectors: {
        selected: "[selected]",
        disabled: ":disabled",
    },
    partSelectors: {
        content: ".content",
    },
    interactivity: Interactivity.disabledAttribute,
    focus: Focus.contextFocused(),
} satisfies PlatformBindingFor<typeof tabDocumentation>;
