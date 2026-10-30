import { DefaultDesignSystem } from "../../design-system.js";
import { composeTabPanel } from "./tab-panel.compose.js";
import { styleRules } from "./tab-panel.styles.rules.js";

/**
 * The Tab Panel custom element definition. Implements {@link TabPanel}.
 *
 * @remarks
 * HTML Element: \<adaptive-tab-panel\>
 *
 * @public
 */
export const tabPanelDefinition = composeTabPanel(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
