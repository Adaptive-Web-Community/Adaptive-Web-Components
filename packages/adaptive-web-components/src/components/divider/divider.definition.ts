import { DefaultDesignSystem } from "../../design-system.js";
import { composeDivider } from "./divider.compose.js";

/**
 * The Divider custom element definition. Implements {@link @microsoft/fast-foundation#FASTDivider}.
 *
 * @remarks
 * HTML Element: \<adaptive-divider\>
 *
 * @public
 */
export const dividerDefinition = composeDivider(DefaultDesignSystem);