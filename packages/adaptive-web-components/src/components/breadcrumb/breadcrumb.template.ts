import { ElementViewTemplate } from "@microsoft/fast-element";
import { breadcrumbTemplate, FASTBreadcrumb } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const BreadcrumbConditions = {
};

/**
 * @public
 */
export const BreadcrumbParts = {
    list: "list",
};

/**
 * @public
 */
export const BreadcrumbAnatomy: ComponentAnatomy<typeof BreadcrumbConditions, typeof BreadcrumbParts> = {
    interactivity: Interactivity.never,
    conditions: BreadcrumbConditions,
    parts: BreadcrumbParts,
};

/**
 * Default Breadcrumb template, {@link @microsoft/fast-foundation#breadcrumbTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBreadcrumb> =
    (ds: DesignSystem) =>
        breadcrumbTemplate();
