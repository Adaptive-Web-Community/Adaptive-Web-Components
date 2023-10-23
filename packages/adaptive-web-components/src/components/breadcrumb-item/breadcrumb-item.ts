import { FASTBreadcrumbItem } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of BreadcrumbItem. Extends {@link @microsoft/fast-foundation#FASTBreadcrumbItem}.
 *
 * @public
 */
export class AdaptiveBreadcrumbItem extends FASTBreadcrumbItem {
    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
