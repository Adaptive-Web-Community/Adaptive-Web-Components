import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { listboxDocumentation } from "./listbox.documentation.js";

/**
 * Web platform selectors and style hooks for {@link listboxDocumentation}.
 *
 * @public
 */
export const listboxWebBinding = {
    conditionSelectors: {
        hideLabel: "[hide-label]",
        multiple: "[multiple]",
        readOnly: "[readonly]",
        disabled: ":disabled",
        required: "[required]",
    },
    partSelectors: {
        label: ".label",
        options: ".options",
    },
    interactivity: {
        interactive: ":not(:disabled, :state(disabled))",
        disabled: ":is(:disabled, :state(disabled))",
        active: ":is(:active, :state(active))",
    },
    focus: Focus.contextChildFocused("options"),
} satisfies PlatformBindingFor<typeof listboxDocumentation>;
