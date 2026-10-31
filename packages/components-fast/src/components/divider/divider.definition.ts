import type { ComponentDefinition } from "../../design-system.js";
import { composeDivider } from "./divider.compose.js";
import { styleRules } from "./divider.styles.rules.js";

/**
 * The Divider custom element definition. Implements {@link Divider}.
 *
 * @remarks
 * HTML Element: \<adaptive-divider\>
 *
 * @public
 */
export const dividerDefinition: ComponentDefinition = ds => composeDivider(
    ds,
    {
        styleRules,
    }
);
