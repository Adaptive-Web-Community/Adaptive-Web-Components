import { attr } from "@microsoft/fast-element";
import { FASTMenuItem } from "@microsoft/fast-foundation";

/**
 * Types of menu item column count.
 * @internal
 */
export type AdaptiveMenuItemColumnCount = 0 | 1 | 2;

/**
 * The Adaptive version of MenuItem. Extends {@link @microsoft/fast-foundation#FASTMenuItem}.
 *
 * @public
 */
export class AdaptiveMenuItem extends FASTMenuItem {
    /**
     * Managed by {@link AdaptiveMenu} to align checkbox or radio controls and `start` slot content properly.
     * 
     * @public
     */
    @attr({ attribute: "start-column-count" })
    public startColumnCount: AdaptiveMenuItemColumnCount;

    // public connectedCallback(): void {
    //     super.connectedCallback();

    //     if (!this.startColumnCount) {
    //         this.startColumnCount = 0;
    //     }
    // }
}