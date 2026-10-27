import { elements, type ElementViewTemplate, html, slotted, when } from "@microsoft/fast-element";
import { MenuItemParts, MenuItemType, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { MenuItem } from "./menu-item.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the menu item.
 *
 * @beta
 */
export const MenuItemStatics = {
    checkbox: "menu-item-checkbox-indicator",
    radio: "menu-item-radio-indicator",
    submenu: "menu-item-submenu-item"
} as const;

/**
 * @beta
 */
export type MenuItemStatics = ValuesOf<typeof MenuItemStatics>;

/**
 * @public
 */
export const MenuItemConditions = {
    checked: ":state(checked)",
    expanded: ":state(expanded)",
};

export { MenuItemParts };

/**
 * @public
 */
export const MenuItemAnatomy: ComponentAnatomy<typeof MenuItemConditions, typeof MenuItemParts> = {
    interactivity: {
        interactive: ":not(:state(disabled))",
        disabled: ":state(disabled)",
    },
    conditions: MenuItemConditions,
    parts: MenuItemParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Menu Item template: the indicator of a checkbox or radio item, the content, the icon of a submenu, and the submenu.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<MenuItem> =
    (ds: DesignSystem) => html<MenuItem>`
        <span class="indicator" part="indicator" aria-hidden="true" ?hidden="${x => x.type === MenuItemType.item}">
            ${when(x => x.type === MenuItemType.checkbox, html`
                <slot name="checkbox-indicator">${staticallyCompose(ds.statics.get(MenuItemStatics.checkbox))}</slot>
            `)}
            ${when(x => x.type === MenuItemType.radio, html`
                <slot name="radio-indicator">${staticallyCompose(ds.statics.get(MenuItemStatics.radio))}</slot>
            `)}
        </span>
        <slot name="start"></slot>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <slot name="end"></slot>
        <span class="submenu-icon" part="submenu-icon" aria-hidden="true" ?hidden="${x => !x.submenu}">
            <slot name="submenu-icon">${staticallyCompose(ds.statics.get(MenuItemStatics.submenu))}</slot>
        </span>
        <slot name="submenu" ${slotted({ property: "slottedSubmenu", filter: elements() })}></slot>
    `;
