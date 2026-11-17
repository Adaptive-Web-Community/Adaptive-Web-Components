import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { menuItemDocumentation } from "./menu-item.documentation.js";

/**
 * Web platform selectors and style hooks for {@link menuItemDocumentation}.
 *
 * @public
 */
export const menuItemWebBinding = {
    conditionSelectors: {
        type: {
            item: ':is(:not([type]), [type="item"])',
            checkbox: '[type="checkbox"]',
            radio: '[type="radio"]',
        },
        checked: ":state(checked)",
        disabled: ":state(disabled)",
        expanded: ":state(expanded)",
    },
    partSelectors: {
        indicator: ".indicator",
        content: ".content",
        submenuIcon: ".submenu-icon",
    },
    interactivity: {
        interactive: ":not(:state(disabled))",
        disabled: ":state(disabled)",
    },
    focus: Focus.contextFocused(),
} satisfies PlatformBindingFor<typeof menuItemDocumentation>;
