import { Swatch } from "@adaptive-web/adaptive-ui";
import { fillColor } from "@adaptive-web/adaptive-ui/reference";
import { FASTElement, observable } from "@microsoft/fast-element";
import { composedParent } from "@microsoft/fast-element/utilities.js";
import { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";

/**
 * A component for providing design token values. Extends {@link @microsoft/fast-element#FASTElement}.
 *
 * @public
 */
export class DesignTokenContext extends FASTElement {
    /**
     * The DesignToken value to set to the `fillColor` token.
     *
     * @public
     */
    @observable
    public fillColor: DesignToken<Swatch> | null = null;
    /** @internal */
    public fillColorChanged(prev: DesignToken<Swatch> | null, next: DesignToken<Swatch> | null) {
        if (next) {
            const swatch = next.getValueFor(this);
            console.log("fillColorChanged", swatch.toColorString(), next, this);

            const parent = this.getParent(this);
            console.log("  parent", parent);
            fillColor.setValueFor(this, (resolve: DesignTokenResolver) => {
                const value = next.getValueFor(parent || this);
                console.log("  resolve - default:", resolve(next).toColorString(), "value", value.toColorString());
                return value;
            });
        } else {
            fillColor.deleteValueFor(this);
        }
    }

    private getParent(element: FASTElement): FASTElement | null {
        let parent: HTMLElement | null = composedParent(element);

        while (parent !== null) {
            if (parent instanceof FASTElement) {
                return parent as FASTElement;
            }

            parent = composedParent(parent);
        }

        return null;
    }
}
