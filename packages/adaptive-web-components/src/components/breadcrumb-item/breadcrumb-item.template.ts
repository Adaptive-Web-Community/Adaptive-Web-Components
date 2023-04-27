import { ElementViewTemplate } from "@microsoft/fast-element";
import { breadcrumbItemTemplate, FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the breadcrumb item.
 */
export const BreadcrumbItemStatics = {
    separator: "breadcrumb-item-separator"
} as const;

export type BreadcrumbItemStatics = ValuesOf<typeof BreadcrumbItemStatics>;

export const BreadcrumbItemConditions = {};

export const BreadcrumbItemParts = {
    control: "control",
    content: "content",
    listitem: "listitem",
    separator: "separator",
};

export const BreadcrumbItemAnatomy: ComponentAnatomy<typeof BreadcrumbItemConditions, typeof BreadcrumbItemParts> = {
    interactivity: Interactivity.hrefAttribute,
    conditions: BreadcrumbItemConditions,
    parts: BreadcrumbItemParts,
};

/**
 * Default Breadcrumb Item template, {@link @microsoft/fast-foundation#breadcrumbItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBreadcrumbItem> =
    (ds: DesignSystem) =>
        breadcrumbItemTemplate({
            separator: ds.statics.get(BreadcrumbItemStatics.separator),
        });
