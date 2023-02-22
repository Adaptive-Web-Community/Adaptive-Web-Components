import { DefaultDesignSystem } from "../../design-system.js";
import { composeSearch } from "./search.compose.js";

/**
 * The Search Field custom element definition. Implements {@link @microsoft/fast-foundation#FASTSearch}.
 *
 * @remarks
 * HTML Element: \<adaptive-search\>
 *
 * @public
 */
export const searchDefinition = composeSearch(
	DefaultDesignSystem,
	{
		shadowOptions: {
			delegatesFocus: true
		}
	}
);