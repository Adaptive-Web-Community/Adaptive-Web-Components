import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { tabPanelDocumentation } from "./tab-panel.documentation.js";

/**
 * Web platform selectors and style hooks for {@link tabPanelDocumentation}.
 *
 * @public
 */
export const tabPanelWebBinding = {
    conditionSelectors: {},
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof tabPanelDocumentation>;
