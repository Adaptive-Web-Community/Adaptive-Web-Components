import { FASTMenu, MenuItemRole } from "@microsoft/fast-foundation";
import { AdaptiveMenuItem, AdaptiveMenuItemColumnCount } from "../menu-item/menu-item.js";

/**
 * Type for menu item column count info.
 * @internal
 */
type AdaptiveMenuIndentInfo = { hasControl: boolean; hasStart: boolean };

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

        this.menuItems?.filter(this.isMenuItemElement).forEach((item: HTMLElement) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const indentInfo: AdaptiveMenuIndentInfo = this.menuItems!.reduce(
                (accum: AdaptiveMenuIndentInfo, current: HTMLElement) => {
                    const elementValue = AdaptiveMenu.elementIndent(current as HTMLElement);
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
