import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { labelledWebConditionSelectors } from "../utilities/labelled.web.binding.js";
import { selectDocumentation } from "./select.documentation.js";

/**
 * Web platform selectors and style hooks for {@link selectDocumentation}.
 *
 * @public
 */
export const selectWebBinding = {
    conditionSelectors: {
        ...labelledWebConditionSelectors,
        open: ":state(open)",
        readOnly: "[readonly]",
        disabled: ":disabled",
        required: "[required]",
    },
    partSelectors: {
        label: ".label",
        control: ".control",
        selectedValue: ".selected-value",
        indicator: ".indicator",
        listbox: ".listbox",
    },
    interactivity: {
        interactive: ":not(:disabled, :state(disabled))",
        disabled: ":is(:disabled, :state(disabled))",
        active: ":is(:active, :state(active))",
    },
    focus: Focus.partFocused("control"),
} satisfies PlatformBindingFor<typeof selectDocumentation>;
