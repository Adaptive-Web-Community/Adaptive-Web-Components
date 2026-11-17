import { Focus, Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { treeItemDocumentation } from "./tree-item.documentation.js";

/**
 * Web platform selectors and style hooks for {@link treeItemDocumentation}.
 *
 * @public
 */
export const treeItemWebBinding = {
    conditionSelectors: {
        expanded: "[expanded]",
        selected: "[selected]",
        disabled: ":disabled",
        nested: ":state(nested)",
    },
    partSelectors: {
        control: ".control",
        expandCollapseButton: ".expand-collapse-button",
        content: ".content",
        items: ".items",
    },
    interactivity: Interactivity.disabledAttribute,
    focus: Focus.contextChildFocused("control"),
} satisfies PlatformBindingFor<typeof treeItemDocumentation>;
