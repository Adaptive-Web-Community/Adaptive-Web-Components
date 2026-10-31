import type { ComponentDefinition } from "../../design-system.js";
import { composeCard } from "./card.compose.js";
import { styleRules } from "./card.styles.rules.js";

/**
 * The Card custom element definition. Implements {@link Card}.
 *
 * @remarks
 * HTML Element: \<adaptive-card\>
 *
 * @public
 */
export const cardDefinition: ComponentDefinition = ds => composeCard(
    ds,
    {
        styleRules,
    }
);
