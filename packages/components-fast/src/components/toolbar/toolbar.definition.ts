import type { ComponentDefinition } from "../../design-system.js";
import { composeToolbar } from "./toolbar.compose.js";
import { styleRules } from "./toolbar.styles.rules.js";

/**
 * The Toolbar custom element definition. Implements {@link Toolbar}.
 *
 * @remarks
 * HTML Element: \<adaptive-toolbar\>
 *
 * @public
 */
export const toolbarDefinition: ComponentDefinition = ds => composeToolbar(
    ds,
	{
		styleRules,
		shadowOptions: {
			delegatesFocus: true
		}
	}
);
