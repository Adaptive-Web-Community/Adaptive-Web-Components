import { children, elements, type ElementViewTemplate, html, repeat, slotted } from "@microsoft/fast-element";
import {
    DataGridCellType,
    dataGridCellTypeAttribute,
    dataGridRowDocumentation,
    DataGridRowType,
    dataGridRowWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ColumnDefinition } from "../data-grid/column-definition.js";
import type { DataGridRow } from "./data-grid-row.js";

/**
 * @public
 */
export const DataGridRowAnatomy = documentationToComponentAnatomy(dataGridRowDocumentation, dataGridRowWebBinding);

/**
 * Default Data Grid Row template: a cell for each column of a generated row, and the slot.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<DataGridRow> =
    (ds: DesignSystem) => {
        const cell = html.partial(`${ds.prefix}-data-grid-cell`);
        return html<DataGridRow>`
            <div class="cells" ${children({ property: "generatedElements", filter: elements() })}>
                ${repeat(x => x.columnDefinitions ?? [], html<ColumnDefinition, DataGridRow>`
                    <${cell}
                        cell-type="${(x, c) =>
                            dataGridCellTypeAttribute[
                                c.parent.rowType !== DataGridRowType.default
                                    ? DataGridCellType.columnHeader
                                    : x.isRowHeader ? DataGridCellType.rowHeader : DataGridCellType.default
                            ]}"
                        :columnDefinition="${x => x}"
                        :rowData="${(x, c) => c.parent.rowData}"
                    ></${cell}>
                `)}
                <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            </div>
        `;
    };
