import type { BindingConditionSelectorsFor } from "@adaptive-web/adaptive-ui";
import { checkableDocumentation } from "./checkable.documentation.js";

/**
 * Web platform selectors of the conditions of {@link checkableDocumentation}, for the bindings of the components that include it.
 *
 * @public
 */
export const checkableWebConditionSelectors = {
    hideLabel: "[hide-label]",
    checked: ":state(checked)",
    disabled: ":disabled",
} satisfies BindingConditionSelectorsFor<typeof checkableDocumentation.contract>;
