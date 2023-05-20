import { FASTMenu, MenuItemRole } from "@microsoft/fast-foundation";
import { AdaptiveMenuItem, AdaptiveMenuItemColumnCount } from "../menu-item/menu-item.js";

/**
 * Type for menu item column count info.
 * @internal
 */
type AdaptiveMenuIndentInfo = { hasControl: boolean; hasStart: boolean };

/**
 * The Adaptive version of Menu. Extends {@link @microsoft/fast-foundation#FASTMenu}.
 *
 * @public
 */
export class AdaptiveMenu extends FASTMenu {
    private static elementIndent(el: HTMLElement): AdaptiveMenuIndentInfo {
        const role = el.getAttribute("role");
        const startSlot = el.querySelector("[slot=start]");

        return {
            hasControl: role !== MenuItemRole.menuitem,
            hasStart: startSlot !== null,
        };
    }

    protected setItems(): void {
        super.setItems();

        const items = this.menuItems?.filter(this.isMenuItemElement);
        
        items?.forEach((item: HTMLElement) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const indentInfo: AdaptiveMenuIndentInfo = items.reduce(
                (accum: AdaptiveMenuIndentInfo, current: HTMLElement) => {
                    const elementValue = AdaptiveMenu.elementIndent(current);
                    return {
                        hasControl: accum.hasControl || elementValue.hasControl,
                        hasStart: accum.hasStart || elementValue.hasStart,
                    };
                },
                {
                    hasControl: false,
                    hasStart: false,
                }
            );

            const indent: AdaptiveMenuItemColumnCount =
                indentInfo.hasControl && indentInfo.hasStart
                    ? 2
                    : indentInfo.hasControl || indentInfo.hasStart
                        ? 1
                        : 0;

            if (item instanceof AdaptiveMenuItem) {
                item.startColumnCount = indent;
            }
        });
    }
}
