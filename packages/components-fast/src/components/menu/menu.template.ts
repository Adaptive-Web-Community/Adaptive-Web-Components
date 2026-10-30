import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Menu } from "./menu.js";

/**
 * @public
 */
export const MenuConditions = {
    submenu: "[slot='submenu']",
};

/**
 * @public
 */
export const MenuParts = {
};

/**
 * @public
 */
export const MenuAnatomy: ComponentAnatomy<typeof MenuConditions, typeof MenuParts> = {
    interactivity: Interactivity.never,
    conditions: MenuConditions,
    parts: MenuParts,
};

/**
 * Default Menu template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Menu> =
    (ds: DesignSystem) => html<Menu>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
