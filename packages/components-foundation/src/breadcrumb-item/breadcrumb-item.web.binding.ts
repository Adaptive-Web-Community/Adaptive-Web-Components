import { Focus, Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { anchorWebBinding } from "../anchor/anchor.web.binding.js";
import { breadcrumbItemDocumentation } from "./breadcrumb-item.documentation.js";

/**
 * Web platform selectors and style hooks for {@link breadcrumbItemDocumentation}.
 *
 * @public
 */
export const breadcrumbItemWebBinding = {
    conditionSelectors: {
        ...anchorWebBinding.conditionSelectors,
        current: "[aria-current='page']",
    },
    partSelectors: {
        ...anchorWebBinding.partSelectors,
        separator: ".separator",
    },
    interactivity: Interactivity.hrefAttribute,
    focus: Focus.partFocused("control"),
} satisfies PlatformBindingFor<typeof breadcrumbItemDocumentation>;
