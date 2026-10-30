import { observable } from "@microsoft/fast-element";
import { breadcrumbItemAria, type BreadcrumbItemElement } from "@adaptive-web/components-foundation";
import { Anchor } from "../anchor/anchor.js";

/**
 * An item of a {@link Breadcrumb}: a link, with a separator. Implements
 * {@link @adaptive-web/components-foundation#BreadcrumbItemElement}.
 *
 * @public
 */
export class BreadcrumbItem extends Anchor implements BreadcrumbItemElement {
    /**
     * {@inheritDoc @adaptive-web/components-foundation#BreadcrumbItemElement.current}
     */
    @observable
    public current: boolean = false;

    constructor() {
        super();
        Object.assign(this.internals, breadcrumbItemAria());
    }
}
