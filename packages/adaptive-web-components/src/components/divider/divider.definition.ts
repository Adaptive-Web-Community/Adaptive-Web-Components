import { DefaultDesignSystem } from "../../design-system.js";
import { composeDivider } from "./divider.compose.js";
import { styleModules } from "./divider.styles.modules.js";

/**
 * The Divider custom element definition. Implements {@link Divider}.
 *
 * @remarks
 * HTML Element: \<adaptive-divider\>
 *
 * @public
 */
export const dividerDefinition = composeDivider(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
