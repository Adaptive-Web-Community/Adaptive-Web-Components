import { DefaultDesignSystem } from "../../design-system.js";
import { composeListboxOption } from "./listbox-option.compose.js";

/**
 * The option custom element definition. Implements {@link @microsoft/fast-foundation#FASTListboxOption}.
 *
 * @remarks
 * HTML Element: \<adaptive-option\>
 *
 * @public
 */
export const listboxOptionDefinition = composeListboxOption(DefaultDesignSystem);