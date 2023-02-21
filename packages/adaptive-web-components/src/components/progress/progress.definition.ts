import { DefaultDesignSystem } from "../../design-system.js";
import { composeProgress } from "./progress.compose.js";

/**
 * The Progress custom element definition. Implements {@link @microsoft/fast-foundation#FASTProgress}.
 *
 * @remarks
 * HTML Element: \<adaptive-progress\>
 *
 * @public
 */
export const progressDefinition = composeProgress(DefaultDesignSystem);