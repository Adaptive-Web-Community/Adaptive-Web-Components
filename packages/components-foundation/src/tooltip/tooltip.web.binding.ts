import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { tooltipDocumentation } from "./tooltip.documentation.js";

/**
 * Web platform selectors and style hooks for {@link tooltipDocumentation}.
 *
 * @public
 */
export const tooltipWebBinding = {
    conditionSelectors: {
        open: ":popover-open",
        placement: {
            above: ':is(:not([placement]), [placement="above"])',
            aboveStart: '[placement="above-start"]',
            aboveEnd: '[placement="above-end"]',
            below: '[placement="below"]',
            belowStart: '[placement="below-start"]',
            belowEnd: '[placement="below-end"]',
            before: '[placement="before"]',
            beforeTop: '[placement="before-top"]',
            beforeBottom: '[placement="before-bottom"]',
            after: '[placement="after"]',
            afterTop: '[placement="after-top"]',
            afterBottom: '[placement="after-bottom"]',
        },
    },
    partSelectors: {},
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof tooltipDocumentation>;
