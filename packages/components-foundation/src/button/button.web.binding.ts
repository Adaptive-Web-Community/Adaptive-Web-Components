import { type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { buttonDocumentation } from "./button.documentation.js";

/**
 * Web platform selectors and style hooks for {@link buttonDocumentation}.
 *
 * @remarks
 * {@link ButtonParts} documents semantic part ids for templates; this module maps those ids to selectors for styling.
 *
 * @public
 */
export const buttonWebBinding = {
    conditionSelectors: {
        disabled: ":is(:disabled, :state(disabled))",
        type: {
            button: ':is(:not([type]), [type="button"])',
            submit: '[type="submit"]',
            reset: '[type="reset"]',
        },
        hideLabel: "[hide-label]",
    },
    partSelectors: {
        content: ".content",
    },
    interactivity: {
        interactive: ":not(:disabled, :state(disabled))",
        disabled: ":is(:disabled, :state(disabled))",
        active: ":is(:active, :state(active))",
    },
} satisfies PlatformBindingFor<typeof buttonDocumentation>;
