import { DefaultDesignSystem } from "../../design-system.js";
import { composeTab } from "./tab.compose.js";
import { styleModules } from "./tab.styles.modules.js";

/**
 * The Tab custom element definition. Implements {@link @microsoft/fast-foundation#FASTTab}.
 *
 * @remarks
 * HTML Element: \<adaptive-tab\>
 *
 * @public
 */
export const tabDefinition = composeTab(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
