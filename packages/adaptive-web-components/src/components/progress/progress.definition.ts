import { DefaultDesignSystem } from "../../design-system.js";
import { composeProgress } from "./progress.compose.js";
import { styleModules } from "./progress.styles.modules.js";

/**
 * The Progress custom element definition. Implements {@link @microsoft/fast-foundation#FASTProgress}.
 *
 * @remarks
 * HTML Element: \<adaptive-progress\>
 *
 * @public
 */
export const progressDefinition = composeProgress(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
