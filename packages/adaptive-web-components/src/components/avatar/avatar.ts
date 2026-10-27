import { attr, FASTElement } from "@microsoft/fast-element";
import { avatarAria, type AvatarElement } from "@adaptive-web/components-foundation";

/**
 * An avatar. Implements {@link @adaptive-web/components-foundation#AvatarElement}.
 *
 * @public
 */
export class Avatar extends FASTElement implements AvatarElement {
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AvatarElement.name}
     */
    @attr
    public name: string | null = null;
    // Called with the default while the element is constructed, so the default ARIA is there from the start.
    protected nameChanged(): void {
        Object.assign(this.internals, avatarAria(this));
    }
}
