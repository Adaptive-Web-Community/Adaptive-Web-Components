import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { accordionItemDocumentation } from "./accordion-item.documentation.js";

/**
 * Web platform selectors and style hooks for {@link accordionItemDocumentation}.
 *
 * @public
 */
export const accordionItemWebBinding = {
    conditionSelectors: {
        expanded: "[expanded]",
        disabled: ":disabled",
        collapsible: ':not([collapsible="false"])',
    },
    partSelectors: {
        heading: ".heading",
        button: ".button",
        headingContent: ".heading-content",
        icon: ".icon",
        panel: ".panel",
    },
    interactivity: Interactivity.disabledAttribute,
} satisfies PlatformBindingFor<typeof accordionItemDocumentation>;
