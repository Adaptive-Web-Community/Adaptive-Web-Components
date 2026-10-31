import type { ComponentDefinition } from "../../design-system.js";
import { composeTab } from "./tab.compose.js";
import { styleRules } from "./tab.styles.rules.js";

/**
 * The Tab custom element definition. Implements {@link Tab}.
 *
 * @remarks
 * HTML Element: \<adaptive-tab\>
 *
 * @public
 */
export const tabDefinition: ComponentDefinition = ds => composeTab(
    ds,
    {
        styleRules,
    }
);
