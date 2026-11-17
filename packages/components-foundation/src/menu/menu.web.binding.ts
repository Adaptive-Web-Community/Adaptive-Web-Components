import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { menuDocumentation } from "./menu.documentation.js";

/**
 * Web platform selectors and style hooks for {@link menuDocumentation}.
 *
 * @public
 */
export const menuWebBinding = {
    conditionSelectors: {
        submenu: '[slot="submenu"]',
    },
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof menuDocumentation>;
