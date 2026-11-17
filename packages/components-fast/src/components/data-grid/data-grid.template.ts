import { children, elements, type ElementViewTemplate, html, repeat, slotted, when } from "@microsoft/fast-element";
import { dataGridDocumentation, DataGridParts, DataGridRowType, dataGridWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { GenerateHeaderOptions } from "./column-definition.js";
import type { DataGrid } from "./data-grid.js";

/**
 * @public
 */
export const DataGridAnatomy = documentationToComponentAnatomy(dataGridDocumentation, dataGridWebBinding);

/**
 * Default Data Grid template: the rows generated from `rowsData`, with their header, and the slot, in the columns of
 * `--data-grid-template-columns`.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<DataGrid> =
    (ds: DesignSystem) => {
        const row = html.partial(`${ds.prefix}-data-grid-row`);
        return html<DataGrid>`
            <div
                class=${(_) => DataGridParts.rows}
                part=${(_) => DataGridParts.rows}
                style="--data-grid-template-columns: ${x => x.templateColumns}"
                ${children({ property: "generatedElements", filter: elements() })}
            >
                ${when(x => x.generateHeader !== GenerateHeaderOptions.none && x.columns.length > 0, html<DataGrid>`
                    <${row}
                        row-type="${x =>
                            x.generateHeader === GenerateHeaderOptions.sticky ? DataGridRowType.stickyHeader : DataGridRowType.header}"
                        :columnDefinitions="${x => x.columns}"
                    ></${row}>
                `)}
                ${repeat(x => x.rowsData, html<object, DataGrid>`
                    <${row} :rowData="${x => x}" :columnDefinitions="${(x, c) => c.parent.columns}"></${row}>
                `)}
                <slot ${slotted({ property: "slottedElements", filter: elements() })}></slot>
            </div>
        `;
    };
