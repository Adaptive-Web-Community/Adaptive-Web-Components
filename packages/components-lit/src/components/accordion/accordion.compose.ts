import { accordionComposition } from "@adaptive-web/components-foundation";
import type { ComposeOptions, DesignSystem, ElementDefinition } from "../../design-system.js";
import { Accordion } from "./accordion.js";
import { template } from "./accordion.template.js";

/**
 * @public
 */
export function composeAccordion(ds: DesignSystem, options?: ComposeOptions<Accordion>): ElementDefinition<typeof Accordion> {
    return ds.compose(Accordion, accordionComposition, template, options);
}
