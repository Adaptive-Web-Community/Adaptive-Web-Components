import type { BindingConditionSelectorsFor } from "@adaptive-web/adaptive-ui";
import { contentLabelledDocumentation } from "./content-labelled.documentation.js";

/**
 * Web platform selectors of the conditions of {@link contentLabelledDocumentation}, for the bindings of the components that include it.
 *
 * @public
 */
export const contentLabelledWebConditionSelectors = {
    hideLabel: "[hide-label]",
} satisfies BindingConditionSelectorsFor<typeof contentLabelledDocumentation.contract>;
