import { chevronRightIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeBreadcrumbItem } from "./breadcrumb-item.compose.js";
import { BreadcrumbItemStatics } from "./breadcrumb-item.template.js";
import { styleModules } from "./breadcrumb-item.styles.modules.js";

/**
 * The Breadcrumb Item custom element definition. Implements {@link BreadcrumbItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-breadcrumb\>
 *
 * @public
 */
export const breadcrumbItemDefinition = composeBreadcrumbItem(
    DefaultDesignSystem,
    {
        statics: {
            [BreadcrumbItemStatics.separator]: chevronRightIcon,
        },
        styleModules,
    }
);
