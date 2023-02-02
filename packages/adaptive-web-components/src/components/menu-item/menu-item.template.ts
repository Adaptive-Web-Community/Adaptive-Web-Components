import { elements, ElementViewTemplate, html, ref, slotted, ViewTemplate, when } from "@microsoft/fast-element";
import { 
    endSlotTemplate, 
    FASTMenuItem,
     MenuItemOptions, 
     MenuItemRole, 
     startSlotTemplate, 
     staticallyCompose,
} from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the menu item checkbox indicator.
 */
export const MenuItemCheckboxIndicatorKey: string = "menu-item-checkbox-indicator";

/**
 * Key for {@link DesignSystem} `statics` registration for the menu item radio indicator.
 */
export const MenuItemRadioIndicatorKey: string = "menu-item-radio-indicator";

/**
 * Key for {@link DesignSystem} `statics` registration for the menu item submenu icon.
 */
export const MenuItemSubmenuIconKey: string = "menu-item-submenu-icon";

// TODO: Temporary copy of template until https://github.com/microsoft/fast/pull/6286/

/**
 * Default Menu Item template, {@link @microsoft/fast-foundation#menuItemTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTMenuItem> =
    (ds: DesignSystem) => {
        // menuItemTemplate(
        const options: MenuItemOptions = {
            checkboxIndicator: ds.statics.get(MenuItemCheckboxIndicatorKey),
            radioIndicator: ds.statics.get(MenuItemRadioIndicatorKey),
            expandCollapseGlyph: ds.statics.get(MenuItemSubmenuIconKey),
        }

        const templateCache: Map<MenuItemRole, ViewTemplate> = new Map();

        function setTemplateByRole(role: MenuItemRole, options: MenuItemOptions) {
            let existing = templateCache.get(role);
    
            if (!existing) {
                const key = role.replace("menuitem", "");
                const optionsKey = key + "Indicator";
                existing = html<FASTMenuItem>`
                    <span part="${key}-indicator" class="${key}-indicator">
                        <slot name="${key}-indicator">
                            ${staticallyCompose((options as any)[optionsKey])}
                        </slot>
                    </span>
                `;
                templateCache.set(role, existing);
            }
    
            return existing;
        }
    
        return html<FASTMenuItem>`
            <template
                aria-haspopup="${x => (x.hasSubmenu ? "menu" : void 0)}"
                aria-checked="${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}"
                aria-disabled="${x => x.disabled}"
                aria-expanded="${x => x.expanded}"
                @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
                @click="${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}"
                @mouseover="${(x, c) => x.handleMouseOver(c.event as MouseEvent)}"
                @mouseout="${(x, c) => x.handleMouseOut(c.event as MouseEvent)}"
            >
                ${when(
                    x => x.role !== MenuItemRole.menuitem,
                    html<FASTMenuItem>`
                        ${x => setTemplateByRole(x.role, options)}
                    `
                )}
                ${startSlotTemplate(options)}
                <span class="content" part="content">
                    <slot></slot>
                </span>
                ${endSlotTemplate(options)}
                ${when(
                    x => x.hasSubmenu,
                    html<FASTMenuItem>`
                        <span part="submenu-icon" class="submenu-icon">
                            <slot name="submenu-icon">
                                ${staticallyCompose(options.expandCollapseGlyph)}
                            </slot>
                        </span>
                    `
                )}
                <span
                    ?hidden="${x => !x.expanded}"
                    class="submenu-container"
                    part="submenu-container"
                    ${ref("submenuContainer")}
                >
                    <slot
                        name="submenu"
                        ${slotted({
                            property: "slottedSubmenu",
                            filter: elements("[role='menu']"),
                        })}
                    ></slot>
                </span>
            </template>
        `;
    };
