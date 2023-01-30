import { css, ElementStyles } from "@microsoft/fast-element";
import { FASTSelect } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Select. Extends {@link @microsoft/fast-foundation#FASTSelect}.
 */
export class AdaptiveSelect extends FASTSelect {
    private computedStylesheet?: ElementStyles;

    public multipleChanged(prev: boolean | undefined, next: boolean): void {
        super.multipleChanged(prev, next);
        this.updateComputedStylesheet();
    }

    protected sizeChanged(prev: number | undefined, next: number): void {
        super.sizeChanged(prev, next);
        this.updateComputedStylesheet();
    }

    /**
     * Updates an internal stylesheet with calculated CSS custom properties.
     *
     * @internal
     */
    protected updateComputedStylesheet(): void {
        this.$fastController.removeStyles(this.computedStylesheet);

        if (this.collapsible) {
            return;
        }

        this.computedStylesheet = css`
            :host {
                --size: ${`${this.size ?? (this.multiple ? 4 : 0)}`};
            }
        `;

        this.$fastController.addStyles(this.computedStylesheet);
    }
}
