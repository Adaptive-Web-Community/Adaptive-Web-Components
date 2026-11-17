import { Focus, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { checkableWebConditionSelectors } from "../checkable/checkable.web.binding.js";
import { switchDocumentation } from "./switch.documentation.js";

/**
 * Web platform selectors and style hooks for {@link switchDocumentation}.
 *
 * @public
 */
export const switchWebBinding = {
    conditionSelectors: {
        ...checkableWebConditionSelectors,
        readOnly: ":state(readonly)",
        required: "[required]",
    },
    partSelectors: {
        label: ".label",
        switch: ".switch",
        thumb: ".thumb",
    },
    interactivity: {
        interactive: ":not(:disabled, :state(disabled))",
        disabled: ":is(:disabled, :state(disabled))",
        active: ":is(:active, :state(active))",
    },
    focus: Focus.contextFocused(),
    cursor: false,
} satisfies PlatformBindingFor<typeof switchDocumentation>;
