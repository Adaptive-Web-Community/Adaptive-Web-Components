import { DefaultDesignSystem } from "../../design-system.js";
import { composeDialog } from "./dialog.compose.js";

/**
 * The Dialog custom element definition. Implements {@link @microsoft/fast-foundation#FASTDialog}.
 *
 * @remarks
 * HTML Element: \<adaptive-dialog\>
 *
 * @public
 */
export const dialogDefinition = composeDialog(DefaultDesignSystem);