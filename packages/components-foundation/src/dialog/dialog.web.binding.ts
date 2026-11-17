import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { dialogDocumentation } from "./dialog.documentation.js";

/**
 * Web platform selectors and style hooks for {@link dialogDocumentation}.
 *
 * @public
 */
export const dialogWebBinding = {
    conditionSelectors: {
        modal: ":state(modal)",
        open: ":state(open)",
        closedBy: {
            any: '[closedby="any"]',
            closeRequest: ':is(:not([closedby]), [closedby="closerequest"])',
            none: '[closedby="none"]',
        },
    },
    partSelectors: {
        control: ".control",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof dialogDocumentation>;
