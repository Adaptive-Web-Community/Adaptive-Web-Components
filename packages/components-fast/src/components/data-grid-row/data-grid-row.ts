import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { dataGridRowAria, type DataGridRowElement, DataGridRowType } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";
import { DataGridCell } from "../data-grid-cell/data-grid-cell.js";
import type { ColumnDefinition } from "../data-grid/column-definition.js";

/**
 * A row of a {@link DataGrid}. Implements {@link @adaptive-web/components-foundation#DataGridRowElement}.
 *
 * @remarks
 * A generated row renders a cell for each column definition, before its slot.
 *
 * @public
 */
export class DataGridRow extends FASTElement implements DataGridRowElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridRowElement.cells}
     */
    @observable
    public cells: DataGridCell[] = [];

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridRowElement.rowType}
     */
    @attr({ attribute: "row-type" })
    public rowType: DataGridRowType = DataGridRowType.default;
    protected rowTypeChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridRowElement.selected}
     */
    @attr({ mode: "boolean" })
    public selected: boolean = false;
    protected selectedChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DataGridRowElement.selectable}
     */
    @observable
    public selectable: boolean = false;
    protected selectableChanged(): void {
        this.updateAria();
    }

    /**
     * The data of a generated row.
     */
    @observable
    public rowData: object | null = null;

    /**
     * The columns of a generated row.
     */
    @observable
    public columnDefinitions: readonly ColumnDefinition[] | null = null;

    /**
     * The cells the template rendered, and its slot.
     *
     * @internal
     */
    @observable
    public generatedElements: Element[] = [];
    protected generatedElementsChanged(): void {
        this.updateCells();
    }

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateCells();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.updateCells();
    }

    // The two kinds of cells change while the element is constructed and connected, before the element has both.
    private updateCells(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        const elements = [...this.generatedElements, ...this.slottedElements];
        this.cells = elements.filter((element): element is DataGridCell => element instanceof DataGridCell);
        onDefined(elements, this.$fastController.definition.registry, () => this.updateCells());
    }

    private updateAria(): void {
        Object.assign(this.internals, dataGridRowAria(this));
    }
}
