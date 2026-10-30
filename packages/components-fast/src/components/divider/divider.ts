import { attr, FASTElement } from "@microsoft/fast-element";
import { dividerAria, type DividerElement, Orientation } from "@adaptive-web/components-foundation";

/**
 * A divider. Implements {@link @adaptive-web/components-foundation#DividerElement}.
 *
 * @public
 */
export class Divider extends FASTElement implements DividerElement {
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DividerElement.orientation}
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;
    // Called with the default while the element is constructed, so the default ARIA is there from the start.
    protected orientationChanged(): void {
        Object.assign(this.internals, dividerAria(this));
    }
}
