import { DefaultDesignSystem } from "../../design-system.js";
import { composeDisclosure } from "./disclosure.compose.js";

/**
 * The Disclosure custom element definition. Implements {@link @microsoft/fast-foundation#FASTDisclosure}.
 *
 * @remarks
 * HTML Element: \<adaptive-disclosure\>
 *
 * @public
 */
export const disclosureDefinition = composeDisclosure(DefaultDesignSystem);