import { DefaultDesignSystem } from "../../design-system.js";
import { composeBreadcrumb } from "./breadcrumb.compose.js";
import { styleRules } from "./breadcrumb.styles.rules.js";

/**
 * The Breadcrumb custom element definition. Implements {@link Breadcrumb}.
 *
 * @remarks
 * HTML Element: \<adaptive-breadcrumb\>
 *
 * @public
 */
export const breadcrumbDefinition = composeBreadcrumb(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
