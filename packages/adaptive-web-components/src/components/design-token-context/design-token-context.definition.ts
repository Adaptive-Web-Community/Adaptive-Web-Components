import { DefaultDesignSystem } from "../../design-system.js";
import { composeDesignTokenContext } from "./design-token-context.compose.js";
import { styleModules } from "./design-token-context.styles.modules.js";

/**
 * The DesignTokenContext custom element definition. Implements {@link @microsoft/fast-element#FASTElement}.
 *
 * @remarks
 * HTML Element: \<adaptive-design-token-context\>
 *
 * @public
 */
export const designTokenContextDefinition = composeDesignTokenContext(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
