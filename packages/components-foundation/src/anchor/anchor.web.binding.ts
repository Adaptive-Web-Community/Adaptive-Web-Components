import { Focus, Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { contentLabelledWebConditionSelectors } from "../utilities/content-labelled.web.binding.js";
import { anchorDocumentation } from "./anchor.documentation.js";

/**
 * Web platform selectors and style hooks for {@link anchorDocumentation}.
 *
 * @public
 */
export const anchorWebBinding = {
    conditionSelectors: {
        ...contentLabelledWebConditionSelectors,
    },
    partSelectors: {
        control: ".control",
        content: ".content",
    },
    interactivity: Interactivity.hrefAttribute,
    focus: Focus.partFocused("control"),
} satisfies PlatformBindingFor<typeof anchorDocumentation>;
