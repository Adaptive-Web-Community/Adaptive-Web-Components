import { DefaultDesignSystem } from "../../design-system.js";
import { composeCard } from "./card.compose.js";

/**
 * The Card custom element definition. Implements {@link @microsoft/fast-foundation#FASTCard}.
 *
 * @remarks
 * HTML Element: \<adaptive-card\>
 *
 * @public
 */
export const cardDefinition = composeCard(DefaultDesignSystem);