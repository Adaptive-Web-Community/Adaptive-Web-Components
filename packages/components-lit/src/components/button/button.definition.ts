import { buttonStyleRules } from "@adaptive-web/components-foundation";
import type { ComponentDefinition } from "../../design-system.js";
import { composeButton } from "./button.compose.js";

/**
 * The Button custom element definition. Implements {@link Button}.
 *
 * @remarks
 * HTML Element: \<adaptive-button\>
 *
 * @public
 */
export const buttonDefinition: ComponentDefinition = ds => composeButton(ds, { styleRules: buttonStyleRules });
