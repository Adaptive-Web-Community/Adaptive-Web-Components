import { DefaultDesignSystem } from "../../design-system.js";
import { composeListbox } from "./listbox.compose.js";

/**
 * The Listbox custom element definition. Implements {@link @microsoft/fast-foundation#FASTListboxElement}.
 *
 * @remarks
 * HTML Element: \<adaptive-listbox\>
 *
 * @public
 */
export const listboxDefinition = composeListbox(DefaultDesignSystem);