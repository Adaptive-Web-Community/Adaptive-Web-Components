import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { treeViewDocumentation } from "./tree-view.documentation.js";

/**
 * Web platform selectors and style hooks for {@link treeViewDocumentation}.
 *
 * @public
 */
export const treeViewWebBinding = {
    conditionSelectors: {},
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof treeViewDocumentation>;
