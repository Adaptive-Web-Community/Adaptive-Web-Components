import { FASTBreadcrumbItem } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Breadcrumb Item. Extends {@link @microsoft/fast-foundation#FASTBreadcrumbItem}.
 *
 * @public
 */
export class BreadcrumbItem extends FASTBreadcrumbItem {
    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
