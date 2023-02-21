import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeBreadcrumbItem } from "./breadcrumb-item.compose.js";
import { BreadcrumbItemIconKeys } from "./breadcrumb-item.template.js";

/**
 * The Breadcrumb custom element definition. Implements {@link @microsoft/fast-foundation#FASTBreadcrumb}.
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
            [BreadcrumbItemIconKeys.separator]: chevronRightIcon
        },
        shadowOptions: {
            delegatesFocus: true
        }
    }
);
