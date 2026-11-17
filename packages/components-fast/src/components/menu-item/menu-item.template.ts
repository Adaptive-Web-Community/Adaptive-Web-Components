import { elements, type ElementViewTemplate, html, slotted, when } from "@microsoft/fast-element";
import {
    menuItemDocumentation,
    MenuItemParts,
    MenuItemSlots,
    MenuItemType,
    menuItemWebBinding,
    type ValuesOf,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { MenuItem } from "./menu-item.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the menu item.
 *
 * @public
 */
export const MenuItemStatics = {
    checkbox: "menu-item-checkbox-indicator",
    radio: "menu-item-radio-indicator",
    submenu: "menu-item-submenu-item",
} as const;

/**
 * @public
 */
export type MenuItemStatics = ValuesOf<typeof MenuItemStatics>;

/**
 * @public
 */
export const MenuItemAnatomy = documentationToComponentAnatomy(menuItemDocumentation, menuItemWebBinding);

/**
 * Default Menu Item template: the indicator of a checkbox or radio item, the content, the icon of a submenu, and the submenu.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<MenuItem> =
    (ds: DesignSystem) => html<MenuItem>`
        <span class=${(_) => MenuItemParts.indicator} part=${(_) => MenuItemParts.indicator} aria-hidden="true" ?hidden="${x => x.type === MenuItemType.item}">
            ${when(x => x.type === MenuItemType.checkbox, html`
                <slot name=${(_) => MenuItemSlots.checkboxIndicator}>${staticallyCompose(ds.statics.get(MenuItemStatics.checkbox))}</slot>
            `)}
            ${when(x => x.type === MenuItemType.radio, html`
                <slot name=${(_) => MenuItemSlots.radioIndicator}>${staticallyCompose(ds.statics.get(MenuItemStatics.radio))}</slot>
            `)}
        </span>
        <slot name=${(_) => MenuItemSlots.start}></slot>
        <span class=${(_) => MenuItemParts.content} part=${(_) => MenuItemParts.content}>
            <slot></slot>
        </span>
        <slot name=${(_) => MenuItemSlots.end}></slot>
        <span class=${(_) => MenuItemParts.submenuIcon} part=${(_) => MenuItemParts.submenuIcon} aria-hidden="true" ?hidden="${x => !x.submenu}">
            <slot name=${(_) => MenuItemSlots.submenuIcon}>${staticallyCompose(ds.statics.get(MenuItemStatics.submenu))}</slot>
        </span>
        <slot name=${(_) => MenuItemSlots.submenu} ${slotted({ property: "slottedSubmenu", filter: elements() })}></slot>
    `;
