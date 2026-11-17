import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { accordionDocumentation } from "./accordion.documentation.js";

/**
 * Web platform selectors and style hooks for {@link accordionDocumentation}.
 *
 * @public
 */
export const accordionWebBinding = {
    conditionSelectors: {
        expandMode: {
            single: '[expand-mode="single"]',
            multi: ':is(:not([expand-mode]), [expand-mode="multi"])',
        },
    },
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof accordionDocumentation>;
