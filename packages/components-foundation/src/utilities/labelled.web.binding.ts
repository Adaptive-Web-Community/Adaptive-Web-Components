import type { BindingConditionSelectorsFor } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "./labelled.documentation.js";

/**
 * Web platform selectors of the conditions of {@link labelledDocumentation}, for the bindings of the components that include it.
 *
 * @public
 */
export const labelledWebConditionSelectors = {
    hideLabel: "[hide-label]",
} satisfies BindingConditionSelectorsFor<typeof labelledDocumentation.contract>;
