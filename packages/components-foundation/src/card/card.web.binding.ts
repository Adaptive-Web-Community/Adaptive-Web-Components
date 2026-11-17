import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { cardDocumentation } from "./card.documentation.js";

/**
 * Web platform selectors and style hooks for {@link cardDocumentation}.
 *
 * @public
 */
export const cardWebBinding = {
    conditionSelectors: {},
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof cardDocumentation>;
