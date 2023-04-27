import { DefaultDesignSystem } from "../../design-system.js";
import { composeTabPanel } from "./tab-panel.compose.js";
import { styleModules } from "./tab-panel.styles.modules.js";

/**
 * The Tab Panel custom element definition. Implements {@link @microsoft/fast-foundation#FASTTabPanel}.
 *
 * @remarks
 * HTML Element: \<adaptive-tab-panel\>
 *
 * @public
 */
export const tabPanelDefinition = composeTabPanel(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
