import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { listboxOptionDocumentation } from "./listbox-option.documentation.js";

/**
 * Web platform selectors and style hooks for {@link listboxOptionDocumentation}.
 *
 * @public
 */
export const listboxOptionWebBinding = {
    conditionSelectors: {
        selected: ":state(selected)",
        active: ":state(active)",
        disabled: ":disabled",
    },
    partSelectors: {
        content: ".content",
    },
    interactivity: Interactivity.disabledAttribute,
} satisfies PlatformBindingFor<typeof listboxOptionDocumentation>;
