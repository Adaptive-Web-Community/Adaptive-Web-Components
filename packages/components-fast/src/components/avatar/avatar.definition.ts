import { DefaultDesignSystem } from "../../design-system.js";
import { composeAvatar } from "./avatar.compose.js";
import { styleRules } from "./avatar.styles.rules.js";

/**
 * The Avatar custom element definition. Implements {@link Avatar}.
 *
 * @remarks
 * HTML Element: \<adaptive-avatar\>
 *
 * @public
 */
export const avatarDefinition = composeAvatar(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
