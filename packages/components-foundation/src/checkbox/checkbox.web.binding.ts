import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { checkableWebConditionSelectors } from "../checkable/checkable.web.binding.js";
import { checkboxDocumentation } from "./checkbox.documentation.js";

/**
 * Web platform selectors and style hooks for {@link checkboxDocumentation}.
 *
 * @public
 */
export const checkboxWebBinding = {
    conditionSelectors: {
        ...checkableWebConditionSelectors,
        indeterminate: ":state(indeterminate)",
        readOnly: ":state(readonly)",
        required: "[required]",
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
} satisfies PlatformBindingFor<typeof checkboxDocumentation>;
