import { DefaultDesignSystem } from "../../design-system.js";
import { composeTabs } from "./tabs.compose.js";

/**
 * The Tabs custom element definition. Implements {@link @microsoft/fast-foundation#FASTTabs}.
 *
 * @remarks
 * HTML Element: \<adaptive-tabs\>
 *
 * @public
 */
export const tabsDefinition = composeTabs(DefaultDesignSystem);