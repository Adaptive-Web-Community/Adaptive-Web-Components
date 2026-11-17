import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { dataGridCellDocumentation, dataGridCellWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { DataGridCell } from "./data-grid-cell.js";

/**
 * @public
 */
export const DataGridCellAnatomy = documentationToComponentAnatomy(dataGridCellDocumentation, dataGridCellWebBinding);

/**
 * Default Data Grid Cell template: the generated content, and the slot.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<DataGridCell> =
    (ds: DesignSystem) => html<DataGridCell>`
        ${x => x.content}<slot></slot>
    `;
