import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { listItemDocumentation, listItemWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ListItem } from "./list-item.js";

/**
 * @public
 */
export const ListItemAnatomy = documentationToComponentAnatomy(listItemDocumentation, listItemWebBinding);

/**
 * Default List Item template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<ListItem> =
    (ds: DesignSystem) => html<ListItem>`
        <slot></slot>
    `;
