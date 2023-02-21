import { DefaultDesignSystem } from "../../design-system.js";
import { composeTabPanel } from "./tab-panel.compose.js";

/**
 * The Tab Panel custom element definition. Implements {@link @microsoft/fast-foundation#FASTTabPanel}.
 *
 * @remarks
 * HTML Element: \<adaptive-tab-panel\>
 *
 * @public
 */
export const tabPanelDefinition = composeTabPanel(DefaultDesignSystem);