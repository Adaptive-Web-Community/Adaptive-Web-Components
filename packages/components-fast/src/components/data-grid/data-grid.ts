import { attr, FASTElement, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { DataGridController, type DataGridElement, DataGridSelectionMode } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";
import { DataGridCell } from "../data-grid-cell/data-grid-cell.js";
import { DataGridRow } from "../data-grid-row/data-grid-row.js";
import { type ColumnDefinition, generateColumns, GenerateHeaderOptions } from "./column-definition.js";

/**
 * A data grid of {@link DataGridRow}s, written in its slot or generated from `rowsData`. Implements
 * {@link @adaptive-web/components-foundation#DataGridElement}.
 *
 * @public
 */
export class DataGrid extends FASTElement implements DataGridElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    private readonly controller = new DataGridController(this, this.internals, {
        isCell: (element): element is DataGridCell => element instanceof DataGridCell,
    });
    private subscribed: DataGridRow[] = [];
    private readonly rowSubscriber: Subscriber = {
        handleChange: (row: DataGridRow, property: string) => {
            if (property === "selected") {
                this.controller.rowSelectedChanged(row);
            } else {
                this.controller.refresh();
            }
        },
    };

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridElement.rows}
     */
    @observable
    public rows: DataGridRow[] = [];

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridElement.selectionMode}
     */
    @attr({ attribute: "selection-mode" })
    public selectionMode: DataGridSelectionMode = DataGridSelectionMode.none;
    protected selectionModeChanged(): void {
        this.controller.refresh();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridElement.gridTemplateColumns}
     */
    @attr({ attribute: "grid-template-columns" })
    public gridTemplateColumns: string | null = null;

    /**
     * Whether a header row is generated from the column definitions.
     *
     * @remarks
     * HTML attribute: `generate-header`. The default is `default`.
     */
    @attr({ attribute: "generate-header" })
    public generateHeader: GenerateHeaderOptions = GenerateHeaderOptions.default;

    /**
     * The data of the rows to generate, one object for each.
     */
    @observable
    public rowsData: object[] = [];

    /**
     * The columns of the generated rows, or `null` for the properties of the first row's data.
     */
    @observable
    public columnDefinitions: ColumnDefinition[] | null = null;

    /**
     * The columns of the generated rows.
     *
     * @internal
     */
    public get columns(): ColumnDefinition[] {
        return this.columnDefinitions ?? (this.rowsData[0] ? generateColumns(this.rowsData[0]) : []);
    }

    /**
     * The columns for the styles: the author's, or as many of the same width as the generated columns.
     *
     * @internal
     */
    public get templateColumns(): string {
        const count = this.columns.length;
        return this.gridTemplateColumns ?? (count > 0 ? `repeat(${count}, 1fr)` : "");
    }

    /**
     * The rows the template generated, and its slot.
     *
     * @internal
     */
    @observable
    public generatedElements: Element[] = [];
    protected generatedElementsChanged(): void {
        this.updateRows();
    }

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateRows();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
        this.updateRows();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    // The two kinds of rows change while the element is constructed and connected, before the element has both.
    private updateRows(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        for (const row of this.subscribed) {
            Observable.getNotifier(row).unsubscribe(this.rowSubscriber);
        }

        const elements = [...this.generatedElements, ...this.slottedElements];
        this.rows = elements.filter((element): element is DataGridRow => element instanceof DataGridRow);
        this.subscribed = this.rows;

        for (const row of this.rows) {
            Observable.getNotifier(row).subscribe(this.rowSubscriber, "cells");
            Observable.getNotifier(row).subscribe(this.rowSubscriber, "selected");
        }

        this.controller.refresh();

        onDefined(elements, this.$fastController.definition.registry, () => this.updateRows());
    }
}
