import { ElementViewTemplate } from "@microsoft/fast-element";
import { breadcrumbTemplate, FASTBreadcrumb } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Breadcrumb template, {@link @microsoft/fast-foundation#breadcrumbTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTBreadcrumb> =
    (ds: DesignSystem) =>
        breadcrumbTemplate();
