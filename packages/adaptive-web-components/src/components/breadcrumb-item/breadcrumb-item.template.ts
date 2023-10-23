import { ElementViewTemplate } from "@microsoft/fast-element";
import { breadcrumbItemTemplate, FASTBreadcrumbItem } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the breadcrumb item.
 *
 * @beta
 */
export const BreadcrumbItemStatics = {
    separator: "breadcrumb-item-separator"
} as const;

/**
 * @beta
 */
export type BreadcrumbItemStatics = ValuesOf<typeof BreadcrumbItemStatics>;

/**
 * @public
 */
export const BreadcrumbItemConditions = {};

/**
 * @public
 */
export const BreadcrumbItemParts = {
    control: "control",
    content: "content",
    listitem: "listitem",
    separator: "separator",
};

/**
 * @public
 */
export const BreadcrumbItemAnatomy: ComponentAnatomy<typeof BreadcrumbItemConditions, typeof BreadcrumbItemParts> = {
    interactivity: Interactivity.hrefAttribute,
    conditions: BreadcrumbItemConditions,
    parts: BreadcrumbItemParts,
    focus: Focus.partFocused("control"),
};

/**
 * Default Breadcrumb Item template, {@link @microsoft/fast-foundation#breadcrumbItemTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBreadcrumbItem> =
    (ds: DesignSystem) =>
        breadcrumbItemTemplate({
            separator: ds.statics.get(BreadcrumbItemStatics.separator),
        });
