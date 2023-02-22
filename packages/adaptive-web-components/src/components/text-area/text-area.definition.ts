import { DefaultDesignSystem } from "../../design-system.js";
import { composeTextArea } from "./text-area.compose.js";

/**
 * The Text Area custom element definition. Implements {@link @microsoft/fast-foundation#FASTTextArea}.
 *
 * @remarks
 * HTML Element: \<adaptive-text-area\>
 *
 * @public
 */
export const textAreaDefinition = composeTextArea(
	DefaultDesignSystem,
	{
		shadowOptions: {
			delegatesFocus: true
		}
	}
);