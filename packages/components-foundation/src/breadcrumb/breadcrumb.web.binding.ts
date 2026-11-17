import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { breadcrumbDocumentation } from "./breadcrumb.documentation.js";

/**
 * Web platform selectors and style hooks for {@link breadcrumbDocumentation}.
 *
 * @public
 */
export const breadcrumbWebBinding = {
    conditionSelectors: {},
    partSelectors: {
        list: ".list",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof breadcrumbDocumentation>;
