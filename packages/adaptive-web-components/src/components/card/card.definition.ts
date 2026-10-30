import { DefaultDesignSystem } from "../../design-system.js";
import { composeCard } from "./card.compose.js";
import { styleModules } from "./card.styles.modules.js";

/**
 * The Card custom element definition. Implements {@link Card}.
 *
 * @remarks
 * HTML Element: \<adaptive-card\>
 *
 * @public
 */
export const cardDefinition = composeCard(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
