import { attr, FASTElement } from "@microsoft/fast-element";
import { skeletonAria, type SkeletonElement, SkeletonShape } from "@adaptive-web/components-foundation";

/**
 * A skeleton. Implements {@link @adaptive-web/components-foundation#SkeletonElement}.
 *
 * @public
 */
export class Skeleton extends FASTElement implements SkeletonElement {
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SkeletonElement.shape}
     */
    @attr
    public shape: SkeletonShape = SkeletonShape.rect;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SkeletonElement.shimmer}
     */
    @attr({ mode: "boolean" })
    public shimmer: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SkeletonElement.pattern}
     */
    @attr
    public pattern: string | null = null;

    constructor() {
        super();
        Object.assign(this.internals, skeletonAria());
    }
}
