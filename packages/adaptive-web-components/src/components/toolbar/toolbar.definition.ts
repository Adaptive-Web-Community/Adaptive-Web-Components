import { DefaultDesignSystem } from "../../design-system.js";
import { composeToolbar } from "./toolbar.compose.js";
import { styleModules } from "./toolbar.styles.modules.js";

/**
 * The Toolbar custom element definition. Implements {@link @microsoft/fast-foundation#FASTToolbar}.
 *
 * @remarks
 * HTML Element: \<adaptive-toolbar\>
 *
 * @public
 */
export const toolbarDefinition = composeToolbar(
	DefaultDesignSystem,
	{
		styleModules,
		shadowOptions: {
			delegatesFocus: true
		}
	}
);
