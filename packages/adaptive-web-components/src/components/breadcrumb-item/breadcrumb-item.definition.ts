import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeBreadcrumbItem } from "./breadcrumb-item.compose.js";
import { BreadcrumbItemSeparatorKey } from "./breadcrumb-item.template.js";

if (!DefaultDesignSystem.statics.has(BreadcrumbItemSeparatorKey)) {
    DefaultDesignSystem.statics.set(BreadcrumbItemSeparatorKey, await fetch(chevronRightIcon).then(x => x.text()));
}

/**
 * The Breadcrumb custom element definition. Implements {@link @microsoft/fast-foundation#FASTBreadcrumb}.
 *
 * @remarks
 * HTML Element: \<adaptive-breadcrumb\>
 *
 * @public
 */
export const breadcrumbItemDefinition = composeBreadcrumbItem(DefaultDesignSystem);
