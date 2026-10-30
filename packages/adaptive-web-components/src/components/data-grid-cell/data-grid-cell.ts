import { attr, FASTElement, observable, type ViewTemplate } from "@microsoft/fast-element";
import { dataGridCellAria, type DataGridCellElement, DataGridCellType } from "@adaptive-web/components-foundation";
import type { ColumnDefinition } from "../data-grid/column-definition.js";

/**
 * A cell of a {@link DataGridRow}. Implements {@link @adaptive-web/components-foundation#DataGridCellElement}.
 *
 * @remarks
 * A generated cell renders its column's template, or its value in the row's data, before its slot.
 *
 * @public
 */
export class DataGridCell extends FASTElement implements DataGridCellElement {
    // Before the properties, whose change handlers use it while the element is constructed.
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridCellElement.cellType}
     */
    @attr({ attribute: "cell-type" })
    public cellType: DataGridCellType = DataGridCellType.default;
    protected cellTypeChanged(): void {
        Object.assign(this.internals, dataGridCellAria(this));
    }

    /**
     * The column of a generated cell.
     */
    @observable
    public columnDefinition: ColumnDefinition | null = null;

    /**
     * The data of a generated cell's row.
     */
    @observable
    public rowData: Record<string, unknown> | null = null;

    /**
     * What a generated cell renders: its column's template, or its title or value.
     *
     * @internal
     */
    public get content(): ViewTemplate | string | null {
        const { columnDefinition: column } = this;
        if (!column) {
            return null;
        }
        if (this.cellType === DataGridCellType.columnHeader) {
            return column.headerCellTemplate ?? column.title ?? column.columnDataKey;
        }
        return column.cellTemplate ?? `${this.rowData?.[column.columnDataKey] ?? ""}`;
    }
}
