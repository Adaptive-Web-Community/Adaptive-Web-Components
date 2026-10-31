import { accordionStyleRules } from "@adaptive-web/components-foundation";
import type { ComponentDefinition } from "../../design-system.js";
import { composeAccordion } from "./accordion.compose.js";

/**
 * The Accordion custom element definition. Implements {@link Accordion}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion\>
 *
 * @public
 */
export const accordionDefinition: ComponentDefinition = ds => composeAccordion(ds, { styleRules: accordionStyleRules });
