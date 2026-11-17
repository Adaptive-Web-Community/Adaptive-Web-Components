import type { BindingConditionSelectorsFor, InteractivityDefinition } from "@adaptive-web/adaptive-ui";
import { textInputDocumentation } from "./text-input.documentation.js";

/**
 * Web platform selectors of the conditions of {@link textInputDocumentation}, for the bindings of the components that include it.
 *
 * @remarks
 * The parts belong to each component, so this is a fragment of a binding, not a binding: each component spreads it into its own
 * `conditionSelectors`, with the selectors of its own properties. The selectors are of a native control with the class `control`.
 *
 * @public
 */
export const textInputWebConditionSelectors = {
    hideLabel: "[hide-label]",
    disabled: ":has(.control:disabled)",
    readOnly: "[readonly]",
    required: "[required]",
} satisfies BindingConditionSelectorsFor<typeof textInputDocumentation.contract>;

/**
 * Web platform interactivity of the components that include {@link textInputDocumentation}: the host isn't the control, so it is
 * disabled when its native control is.
 *
 * @public
 */
export const textInputWebInteractivity = {
    interactive: ":not(:has(.control:disabled))",
    disabled: ":has(.control:disabled)",
    active: ":is(:active, :state(active))",
} satisfies InteractivityDefinition;
