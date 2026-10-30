import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import { dataGridCellAria, type DataGridCellElement, DataGridCellType } from "../data-grid-cell/data-grid-cell.js";
import { dataGridRowAria, type DataGridRowElement, DataGridRowType } from "../data-grid-row/data-grid-row.js";
import { type DataGridElement, DataGridSelectionMode } from "./data-grid.js";
import { DataGridController } from "./data-grid.controller.js";

const { expect } = chai;

class TestCell extends HTMLElement implements DataGridCellElement {
    public cellType: DataGridCellType = DataGridCellType.default;
}
customElements.define("test-grid-cell", TestCell);

class TestRow extends HTMLElement implements DataGridRowElement {
    public rowType: DataGridRowType = DataGridRowType.default;
    public selected = false;
    public selectable = false;
    public get cells(): TestCell[] {
        return Array.from(this.children).filter((child): child is TestCell => child instanceof TestCell);
    }
}
customElements.define("test-grid-row", TestRow);

class TestGrid extends HTMLElement implements DataGridElement {
    public selectionMode: DataGridSelectionMode = DataGridSelectionMode.none;
    public gridTemplateColumns: string | null = null;
    public get rows(): TestRow[] {
        return Array.from(this.children).filter((child): child is TestRow => child instanceof TestRow);
    }
}
customElements.define("test-grid", TestGrid);

const isCell = (element: EventTarget): element is TestCell => element instanceof TestCell;

// A header row and three rows of three cells; the middle cell of the second row has a button.
function setup(configure: (host: TestGrid) => void = () => {}) {
    const host = document.body.appendChild(new TestGrid());
    for (let row = 0; row < 4; row++) {
        const element = host.appendChild(new TestRow());
        if (row === 0) {
            element.rowType = DataGridRowType.header;
        }
        for (let column = 0; column < 3; column++) {
            const cell = element.appendChild(new TestCell());
            cell.textContent = `${row}-${column}`;
            if (row === 0) {
                cell.cellType = DataGridCellType.columnHeader;
            }
        }
    }
    host.rows[2].cells[1].innerHTML = "<button>Edit</button>";
    configure(host);
    const internals = new TestInternals();
    const controller = new DataGridController(host, internals, { isCell });
    controller.connect();
    return { host, internals, controller, cell: (row: number, column: number) => host.rows[row].cells[column] };
}

function press(target: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, composed: true, ...init });
    target.dispatchEvent(event);
    return event;
}

describe("DataGridController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should be a grid with its first cell in the tab order", () => {
        const { internals, cell } = setup();

        expect(internals.role).to.equal("grid");
        expect([cell(0, 0).tabIndex, cell(1, 0).tabIndex]).to.deep.equal([0, -1]);
    });

    it("should move between cells with the arrows, Home, End, and Control with them", () => {
        const { cell } = setup();
        cell(0, 0).focus();

        press(cell(0, 0), "ArrowDown");
        expect(document.activeElement).to.equal(cell(1, 0));

        press(cell(1, 0), "ArrowRight");
        expect(document.activeElement).to.equal(cell(1, 1));

        press(cell(1, 1), "End");
        expect(document.activeElement).to.equal(cell(1, 2));

        press(cell(1, 2), "End", { ctrlKey: true });
        expect(document.activeElement).to.equal(cell(3, 2));

        press(cell(3, 2), "ArrowDown");
        expect(document.activeElement).to.equal(cell(3, 2));

        press(cell(3, 2), "Home", { ctrlKey: true });
        expect(document.activeElement).to.equal(cell(0, 0));
        expect(cell(0, 0).tabIndex).to.equal(0);
        expect(cell(3, 2).tabIndex).to.equal(-1);
    });

    it("should move by a page with Page Down and Page Up", () => {
        const { cell } = setup();
        cell(0, 1).focus();

        press(cell(0, 1), "PageDown");
        expect(document.activeElement).to.equal(cell(3, 1));

        press(cell(3, 1), "PageUp");
        expect(document.activeElement).to.equal(cell(0, 1));
    });

    it("should move into a cell's content with Enter, leave its keys to it, and go back with Escape", () => {
        const { cell } = setup();
        cell(2, 1).focus();
        const button = cell(2, 1).querySelector("button")!;

        expect(button.tabIndex, "out of the tab order").to.equal(-1);

        press(cell(2, 1), "Enter");
        expect(document.activeElement).to.equal(button);

        const arrow = press(button, "ArrowRight");
        expect(arrow.defaultPrevented).to.be.false;

        press(button, "Escape");
        expect(document.activeElement).to.equal(cell(2, 1));
    });

    it("should take a control added to a cell later out of the tab order", async () => {
        const { cell } = setup();

        const link = cell(3, 0).appendChild(document.createElement("a"));
        link.href = "#";
        await new Promise(resolve => setTimeout(resolve));

        expect(link.tabIndex).to.equal(-1);
    });

    describe("selection", () => {
        it("should say the rows can be selected, not the header", () => {
            const { host, internals, controller } = setup(host => {
                host.selectionMode = DataGridSelectionMode.multiRow;
            });
            controller.refresh();

            expect(internals.ariaMultiSelectable).to.equal("true");
            expect(dataGridRowAria(host.rows[1])).to.deep.equal({ role: "row", ariaSelected: "false" });
            expect(dataGridRowAria(host.rows[0])).to.deep.equal({ role: "row", ariaSelected: null });
        });

        it("should select one row with a click and Space in single selection, and emit change", () => {
            const { host, cell } = setup(host => {
                host.selectionMode = DataGridSelectionMode.singleRow;
            });
            let changes = 0;
            host.addEventListener("change", () => changes++);

            cell(1, 0).click();
            cell(2, 2).focus();
            press(cell(2, 2), " ");
            cell(0, 0).click();

            expect(host.rows.map(row => row.selected)).to.deep.equal([false, false, true, false]);
            expect(changes, "the row that is selected emits it, as a radio, not the one unselected").to.equal(2);
        });

        it("should toggle rows, and select all with Control A, in multiple selection", () => {
            const { host, cell } = setup(host => {
                host.selectionMode = DataGridSelectionMode.multiRow;
            });

            cell(1, 0).click();
            cell(3, 0).click();
            expect(host.rows.map(row => row.selected)).to.deep.equal([false, true, false, true]);

            press(cell(1, 0), "a", { ctrlKey: true });
            expect(host.rows.map(row => row.selected)).to.deep.equal([false, true, true, true]);
        });

        it("should not select without a selection mode", () => {
            const { host, cell } = setup();

            cell(1, 0).click();

            expect(host.rows[1].selected).to.be.false;
        });
    });

    it("should give a cell the role of its kind", () => {
        const { cell } = setup();

        expect(dataGridCellAria(cell(0, 0))).to.deep.equal({ role: "columnheader" });
        expect(dataGridCellAria(cell(1, 0))).to.deep.equal({ role: "gridcell" });
    });
});
