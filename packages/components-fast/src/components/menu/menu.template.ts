import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { menuDocumentation, menuWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Menu } from "./menu.js";

/**
 * @public
 */
export const MenuAnatomy = documentationToComponentAnatomy(menuDocumentation, menuWebBinding);

/**
 * Default Menu template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Menu> =
    (ds: DesignSystem) => html<Menu>`
        <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
    `;
