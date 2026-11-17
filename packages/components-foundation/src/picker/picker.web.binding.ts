import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { labelledWebConditionSelectors } from "../utilities/labelled.web.binding.js";
import { pickerDocumentation } from "./picker.documentation.js";

/**
 * Web platform selectors and style hooks for {@link pickerDocumentation}.
 *
 * @public
 */
export const pickerWebBinding = {
    conditionSelectors: {
        ...labelledWebConditionSelectors,
        open: ":state(open)",
        multiple: "[multiple]",
        freeform: "[freeform]",
        loading: "[loading]",
        readOnly: "[readonly]",
        disabled: ":disabled",
        required: "[required]",
    },
    partSelectors: {
        label: ".label",
        root: ".root",
        values: ".values",
        value: ".value",
        valueLabel: ".value-label",
        valueRemove: ".value-remove",
        control: ".control",
        indicator: ".indicator",
        popup: ".popup",
        listbox: ".listbox",
        status: ".status",
    },
    interactivity: {
        interactive: ":not(:disabled, :state(disabled))",
        disabled: ":is(:disabled, :state(disabled))",
        active: ":is(:active, :state(active))",
    },
    focus: Focus.partWithin("root", "control"),
} satisfies PlatformBindingFor<typeof pickerDocumentation>;
