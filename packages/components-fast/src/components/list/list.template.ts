import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { List } from "./list.js";

/**
 * @public
 */
export const ListConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
};

/**
 * @public
 */
export const ListParts = {
};

/**
 * @public
 */
export const ListAnatomy: ComponentAnatomy<typeof ListConditions, typeof ListParts> = {
    interactivity: Interactivity.never,
    conditions: ListConditions,
    parts: ListParts,
};

/**
 * Default List template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<List> =
    (ds: DesignSystem) => html<List>`
        <slot></slot>
    `;
