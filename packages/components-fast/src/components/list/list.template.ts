import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { listDocumentation, listWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { List } from "./list.js";

/**
 * @public
 */
export const ListAnatomy = documentationToComponentAnatomy(listDocumentation, listWebBinding);

/**
 * Default List template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<List> =
    (ds: DesignSystem) => html<List>`
        <slot></slot>
    `;
