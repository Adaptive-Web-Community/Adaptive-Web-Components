import { ElementViewTemplate } from "@microsoft/fast-element";
import { breadcrumbItemTemplate, FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the breadcrumb item separator.
 */
export const BreadcrumbItemIconKeys = {
    separator: "breadcrumb-item-separator"
} as const;

export type BreadcrumbItemIconKeys = ValuesOf<typeof BreadcrumbItemIconKeys>;

/**
 * Default Breadcrumb Item template, {@link @microsoft/fast-foundation#breadcrumbItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBreadcrumbItem> =
    (ds: DesignSystem) =>
        breadcrumbItemTemplate({
            separator: ds.statics.get(BreadcrumbItemIconKeys.separator),
        });
