import { DefaultDesignSystem } from "../../design-system.js";
import { composeBreadcrumb } from "./breadcrumb.compose.js";
import { styleModules } from "./breadcrumb.styles.modules.js";

/**
 * The Breadcrumb custom element definition. Implements {@link @microsoft/fast-foundation#FASTBreadcrumb}.
 *
 * @remarks
 * HTML Element: \<adaptive-breadcrumb\>
 *
 * @public
 */
export const breadcrumbDefinition = composeBreadcrumb(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
