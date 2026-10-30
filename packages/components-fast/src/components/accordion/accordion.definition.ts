import { DefaultDesignSystem } from "../../design-system.js";
import { composeAccordion } from "./accordion.compose.js";
import { styleRules } from "./accordion.styles.rules.js";

/**
 * The Accordion custom element definition. Implements {@link Accordion}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion\>
 *
 * @public
 */
export const accordionDefinition = composeAccordion(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
