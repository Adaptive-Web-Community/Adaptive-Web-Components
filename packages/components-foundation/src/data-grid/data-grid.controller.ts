import type { DataGridCellElement } from "../data-grid-cell/data-grid-cell.js";
import { type DataGridRowElement, DataGridRowType } from "../data-grid-row/data-grid-row.js";
import { type DataGridElement, DataGridSelectionMode } from "./data-grid.js";

/**
 * What a {@link DataGridController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type DataGridInternals = Pick<ElementInternals, "role" | "ariaMultiSelectable">;

/**
 * The options of a {@link DataGridController}.
 *
 * @public
 */
export type DataGridOptions = {
    /**
     * Whether an element is a data grid cell, which a binding knows by its class.
     */
    isCell: (element: EventTarget) => element is DataGridCellElement;
};

// What can take focus in a cell's content: native controls, and elements with a `tabindex`, which the grid sets to -1.
const focusable = "a[href], button, input, select, textarea, [tabindex], [contenteditable='true']";

// Rows that a page moves by, when the grid has no height to measure them by.
const defaultPageSize = 10;

/**
 * The behavior of a {@link DataGridElement}: the `grid` role; one cell in the tab order, and the controls in the cells out of it; the keys
 * of the ARIA data grid, which move the focus between cells, and into a cell's content and back; and the selection of rows, by a click,
 * Space, and Control with A.
 *
 * @remarks
 * The element's binding creates it, calls {@link DataGridController.connect} and {@link DataGridController.disconnect} with the element's
 * lifecycle, {@link DataGridController.refresh} when its rows, their cells, or its selection mode change, and
 * {@link DataGridController.rowSelectedChanged} when a row's `selected` changes. The cells can be in the rows' shadow roots, and the rows in
 * the grid's: the controller finds them through `rows` and `cells`, and the focus through the events' paths.
 *
 * @public
 */
export class DataGridController {
    private active: DataGridCellElement | null = null;
    // A control added to a cell, or one that puts itself in the tab order when it is defined, is taken out of it again.
    private readonly observer = new MutationObserver(() => this.removeContentFromTabOrder());

    constructor(private readonly host: DataGridElement, private readonly internals: DataGridInternals, private readonly options: DataGridOptions) {
        internals.role = "grid";
    }

    /**
     * Starts handling the keyboard, clicks, and focus. For when the element is connected.
     */
    public connect(): void {
        this.host.addEventListener("keydown", this.handleKeydown);
        this.host.addEventListener("click", this.handleClick);
        this.host.addEventListener("focusin", this.handleFocusin);
        this.observer.observe(this.host, { subtree: true, childList: true, attributes: true, attributeFilter: ["tabindex"] });
        this.refresh();
    }

    /**
     * Stops handling the keyboard, clicks, and focus. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("keydown", this.handleKeydown);
        this.host.removeEventListener("click", this.handleClick);
        this.host.removeEventListener("focusin", this.handleFocusin);
        this.observer.disconnect();
    }

    /**
     * The rows, their cells, or the selection mode changed: the rows are told whether they are selectable, and one cell is in the tab order.
     */
    public refresh(): void {
        const { host, internals } = this;
        const selectable = host.selectionMode !== DataGridSelectionMode.none;
        internals.ariaMultiSelectable = host.selectionMode === DataGridSelectionMode.multiRow ? "true" : null;
        for (const row of host.rows) {
            row.selectable = selectable;
        }
        if (host.selectionMode === DataGridSelectionMode.singleRow) {
            const selected = this.dataRows().filter(row => row.selected);
            for (const row of selected.slice(0, -1)) {
                row.selected = false;
            }
        }
        const cells = host.rows.flatMap(row => row.cells);
        if (!this.active || !cells.includes(this.active)) {
            this.active = cells[0] ?? null;
        }
        for (const cell of cells) {
            cell.tabIndex = cell === this.active ? 0 : -1;
        }
        this.removeContentFromTabOrder();
    }

    // The controls in a cell, in its light DOM or its shadow root (a generated cell's template), are out of the tab order, as the ARIA
    // pattern has it: Enter or F2 reaches them. Only those not out of it yet are changed, so the observer settles.
    private removeContentFromTabOrder(): void {
        for (const cell of this.host.rows.flatMap(row => row.cells)) {
            for (const control of this.controlsOf(cell)) {
                if (control.getAttribute("tabindex") !== "-1") {
                    control.tabIndex = -1;
                }
            }
        }
    }

    private controlsOf(cell: DataGridCellElement): HTMLElement[] {
        return [...cell.querySelectorAll<HTMLElement>(focusable), ...(cell.shadowRoot?.querySelectorAll<HTMLElement>(focusable) ?? [])];
    }

    /**
     * A row was selected or unselected, by the user or by code. In single selection, a row that is selected unselects the others.
     */
    public rowSelectedChanged(row: DataGridRowElement): void {
        if (row.selected && this.host.selectionMode === DataGridSelectionMode.singleRow) {
            for (const other of this.dataRows()) {
                if (other !== row && other.selected) {
                    other.selected = false;
                }
            }
        }
    }

    // The rows that can be selected: not the headers.
    private dataRows(): DataGridRowElement[] {
        return this.host.rows.filter(row => row.rowType === DataGridRowType.default);
    }

    private focusCell(cell: DataGridCellElement | undefined): void {
        if (!cell) {
            return;
        }
        const previous = this.active;
        this.active = cell;
        if (previous && previous !== cell) {
            previous.tabIndex = -1;
        }
        cell.tabIndex = 0;
        cell.focus();
        cell.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    }

    // The cell that an event comes from, and its row, through the event's path: a cell can be in a row's shadow root.
    private cellOf(event: Event): { cell: DataGridCellElement; row: DataGridRowElement } | null {
        const cell = event.composedPath().find(this.options.isCell);
        const row = cell && this.host.rows.find(row => row.cells.includes(cell));
        return cell && row ? { cell, row } : null;
    }

    private selectByUser(row: DataGridRowElement, toggle: boolean): void {
        const { selectionMode } = this.host;
        if (selectionMode === DataGridSelectionMode.none || row.rowType !== DataGridRowType.default) {
            return;
        }
        const multiple = selectionMode === DataGridSelectionMode.multiRow;
        const selected = multiple && toggle ? !row.selected : true;
        if (selected === row.selected) {
            return;
        }
        row.selected = selected;
        this.rowSelectedChanged(row);
        row.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private pageSize(row: DataGridRowElement): number {
        const height = row.getBoundingClientRect().height;
        return height > 0 ? Math.max(1, Math.floor(this.host.clientHeight / height)) : defaultPageSize;
    }

    // The keys of the data grid pattern. A key in a cell's content is the content's, except Escape, which goes back to the cell.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        const found = this.cellOf(event);
        if (event.defaultPrevented || !found) {
            return;
        }
        const { cell, row } = found;
        const [origin] = event.composedPath();
        if (origin !== cell) {
            if (event.key === "Escape") {
                event.preventDefault();
                this.focusCell(cell);
            }
            return;
        }

        const { rows } = this.host;
        const rowIndex = rows.indexOf(row);
        const columnIndex = row.cells.indexOf(cell);
        const at = (rowAt: number, columnAt: number) => {
            const target = rows[Math.min(rows.length - 1, Math.max(0, rowAt))];
            return target?.cells[Math.min(target.cells.length - 1, Math.max(0, columnAt))];
        };
        const rtl = getComputedStyle(this.host).direction === "rtl";
        const control = event.ctrlKey || event.metaKey;
        let next: DataGridCellElement | undefined;
        switch (event.key) {
            case "ArrowRight":
                next = row.cells[columnIndex + (rtl ? -1 : 1)];
                break;
            case "ArrowLeft":
                next = row.cells[columnIndex + (rtl ? 1 : -1)];
                break;
            case "ArrowDown":
                next = rows[rowIndex + 1] && at(rowIndex + 1, columnIndex);
                break;
            case "ArrowUp":
                next = rows[rowIndex - 1] && at(rowIndex - 1, columnIndex);
                break;
            case "Home":
                next = control ? at(0, 0) : row.cells[0];
                break;
            case "End":
                next = control ? at(rows.length - 1, Number.MAX_SAFE_INTEGER) : row.cells[row.cells.length - 1];
                break;
            case "PageDown":
                next = at(rowIndex + this.pageSize(row), columnIndex);
                break;
            case "PageUp":
                next = at(rowIndex - this.pageSize(row), columnIndex);
                break;
            case "Enter":
            case "F2":
                next = undefined;
                this.controlsOf(cell)[0]?.focus();
                break;
            case " ":
                this.selectByUser(row, true);
                break;
            case "a":
            case "A":
                if (!control || this.host.selectionMode !== DataGridSelectionMode.multiRow) {
                    return;
                }
                this.selectAll();
                break;
            default:
                return;
        }
        event.preventDefault();
        this.focusCell(next);
    };

    private selectAll(): void {
        const rows = this.dataRows();
        const select = rows.some(row => !row.selected);
        for (const row of rows) {
            if (row.selected !== select) {
                row.selected = select;
                row.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    }

    // A click on a row selects it, or toggles it in multiple selection.
    private readonly handleClick = (event: MouseEvent): void => {
        const found = this.cellOf(event);
        if (found && !event.defaultPrevented) {
            this.selectByUser(found.row, true);
        }
    };

    // The cell that gets the focus, or whose content does, is the one in the tab order.
    private readonly handleFocusin = (event: FocusEvent): void => {
        const found = this.cellOf(event);
        if (found && found.cell !== this.active) {
            if (this.active) {
                this.active.tabIndex = -1;
            }
            this.active = found.cell;
            found.cell.tabIndex = 0;
        }
    };
}
