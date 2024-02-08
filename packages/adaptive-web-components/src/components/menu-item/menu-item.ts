import { attr } from "@microsoft/fast-element";
import { FASTMenuItem } from "@microsoft/fast-foundation";

/**
 * Types of menu item column count.
 * @internal
 */
export type MenuItemColumnCount = 0 | 1 | 2;

/**
 * The Adaptive version of Menu Item. Extends {@link @microsoft/fast-foundation#FASTMenuItem}.
 *
 * @public
 */
export class MenuItem extends FASTMenuItem {
    /**
     * Managed by {@link Menu} to align checkbox or radio controls and `start` slot content properly.
     * 
     * @public
     */
    @attr({ attribute: "start-column-count" })
    public startColumnCount: MenuItemColumnCount;

    // public connectedCallback(): void {
    //     super.connectedCallback();

    //     if (!this.startColumnCount) {
    //         this.startColumnCount = 0;
    //     }
    // }
}