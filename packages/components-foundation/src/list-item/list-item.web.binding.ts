import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { listItemDocumentation } from "./list-item.documentation.js";

/**
 * Web platform selectors and style hooks for {@link listItemDocumentation}.
 *
 * @public
 */
export const listItemWebBinding = {
    conditionSelectors: {},
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof listItemDocumentation>;
