import { DefaultDesignSystem } from "../../design-system.js";
import { composeAvatar } from "./avatar.compose.js";

/**
 * The Avatar custom element definition. Implements {@link @microsoft/fast-foundation#FASTAvatar}.
 *
 * @remarks
 * HTML Element: \<adaptive-avatar\>
 *
 * @public
 */
export const avatarDefinition = composeAvatar(DefaultDesignSystem);
