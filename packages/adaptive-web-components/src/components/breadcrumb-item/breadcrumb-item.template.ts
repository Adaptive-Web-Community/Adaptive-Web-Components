import { ElementViewTemplate } from "@microsoft/fast-element";
import { breadcrumbItemTemplate, FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the breadcrumb item separator.
 */
export const BreadcrumbItemSeparatorKey: string = "breadcrumb-item-separator";

/**
 * Default Breadcrumb Item template, {@link @microsoft/fast-foundation#breadcrumbItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBreadcrumbItem> =
    (ds: DesignSystem) =>
        breadcrumbItemTemplate({
            separator: ds.statics.get(BreadcrumbItemSeparatorKey),
        });
