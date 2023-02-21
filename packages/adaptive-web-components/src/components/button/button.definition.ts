import { DefaultDesignSystem } from "../../design-system.js";
import { composeButton } from "./button.compose.js";

/**
 * The Button custom element definition. Implements {@link AdaptiveButton}.
 *
 * @remarks
 * HTML Element: \<adaptive-button\>
 *
 * @public
 */
export const buttonDefinition = composeButton(
	DefaultDesignSystem,
	{
		shadowOptions: {
			delegatesFocus: true
		}
	}
);
