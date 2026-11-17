import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { checkableWebConditionSelectors } from "../checkable/checkable.web.binding.js";
import { radioDocumentation } from "./radio.documentation.js";

/**
 * Web platform selectors and style hooks for {@link radioDocumentation}.
 *
 * @public
 */
export const radioWebBinding = {
    conditionSelectors: {
        ...checkableWebConditionSelectors,
        groupReadOnly: ":state(readonly)",
        groupDisabled: ":state(disabled)",
    },
    partSelectors: {
        control: ".control",
        label: ".label",
    },
    interactivity: {
        interactive: ":not(:disabled, :state(disabled))",
        disabled: ":is(:disabled, :state(disabled))",
        active: ":is(:active, :state(active))",
    },
    focus: Focus.contextFocused(),
    cursor: false,
} satisfies PlatformBindingFor<typeof radioDocumentation>;
