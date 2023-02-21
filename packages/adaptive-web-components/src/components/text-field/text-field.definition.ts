import { DefaultDesignSystem } from "../../design-system.js";
import { composeTextField } from "./text-field.compose.js";

/**
 * The Text Field custom element definition. Implements {@link @microsoft/fast-foundation#FASTTextField}.
 *
 * @remarks
 * HTML Element: \<adaptive-text-field\>
 *
 * @public
 */
export const textFieldDefinition = composeTextField(
	DefaultDesignSystem,
	{
		shadowOptions: {
			delegatesFocus: true
		}
	}
);