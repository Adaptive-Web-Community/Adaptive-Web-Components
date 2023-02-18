import { DefaultDesignSystem } from "../../design-system.js";
import { composeAccordion } from "./accordion.compose.js";

/**
 * The Accordion custom element definition. Implements {@link @microsoft/fast-foundation#FASTAccordion}.
 *
 * @remarks
 * HTML Element: \<adaptive-accordion\>
 *
 * @public
 */
export const AdaptiveAccordion = composeAccordion(DefaultDesignSystem);
