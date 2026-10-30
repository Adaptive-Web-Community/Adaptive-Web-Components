import { children, elements, type ElementViewTemplate, html, repeat, slotted } from "@microsoft/fast-element";
import { DataGridCellType, DataGridRowType } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ColumnDefinition } from "../data-grid/column-definition.js";
import type { DataGridRow } from "./data-grid-row.js";

/**
 * @public
 */
export const DataGridRowConditions = {
    rowType: {
        default: `[row-type='${DataGridRowType.default}']`,
        header: `[row-type='${DataGridRowType.header}']`,
        stickyHeader: `[row-type='${DataGridRowType.stickyHeader}']`,
    },
    selected: "[selected]",
};

/**
 * @public
 */
export const DataGridRowParts = {
};

/**
 * @public
 */
export const DataGridRowAnatomy: ComponentAnatomy<typeof DataGridRowConditions, typeof DataGridRowParts> = {
    interactivity: Interactivity.never,
    conditions: DataGridRowConditions,
    parts: DataGridRowParts,
};

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
                            c.parent.rowType !== DataGridRowType.default
                                ? DataGridCellType.columnHeader
                                : x.isRowHeader ? DataGridCellType.rowHeader : DataGridCellType.default}"
                        :columnDefinition="${x => x}"
                        :rowData="${(x, c) => c.parent.rowData}"
                    ></${cell}>
                `)}
                <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            </div>
        `;
    };
