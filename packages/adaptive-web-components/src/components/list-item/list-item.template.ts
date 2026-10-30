import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ListItem } from "./list-item.js";

/**
 * @public
 */
export const ListItemConditions = {
};

/**
 * @public
 */
export const ListItemParts = {
};

/**
 * @public
 */
export const ListItemAnatomy: ComponentAnatomy<typeof ListItemConditions, typeof ListItemParts> = {
    interactivity: Interactivity.never,
    conditions: ListItemConditions,
    parts: ListItemParts,
};

/**
 * Default List Item template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<ListItem> =
    (ds: DesignSystem) => html<ListItem>`
        <slot></slot>
    `;
