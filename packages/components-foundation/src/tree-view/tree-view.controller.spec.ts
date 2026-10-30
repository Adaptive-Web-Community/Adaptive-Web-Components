import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import { placeTreeItems, toggleTreeItem, treeItemAria, type TreeItemElement } from "../tree-item/tree-item.js";
import { TreeViewController } from "./tree-view.controller.js";

const { expect } = chai;

// A tree item as a binding has it: its attributes reflected, and its items its child tree items.
class TestTreeItem extends HTMLElement implements TreeItemElement {
    public disabled = false;
    public nested = false;

    public get expanded(): boolean {
        return this.hasAttribute("expanded");
    }
    public set expanded(expanded: boolean) {
        this.toggleAttribute("expanded", expanded);
    }

    public get selected(): boolean {
        return this.hasAttribute("selected");
    }
    public set selected(selected: boolean) {
        this.toggleAttribute("selected", selected);
    }

    public get items(): TestTreeItem[] {
        return Array.from(this.children).filter((child): child is TestTreeItem => child instanceof TestTreeItem);
    }
}
customElements.define("test-tree-item", TestTreeItem);

const isItem = (element: Element): element is TestTreeItem => element instanceof TestTreeItem;

// The markup: a, b (with b1, b2), c.
function setup(configure: (items: Record<string, TestTreeItem>) => void = () => {}) {
    const host = document.body.appendChild(document.createElement("div"));
    host.innerHTML = `
        <test-tree-item id="a">A</test-tree-item>
        <test-tree-item id="b">B<test-tree-item id="b1">B1</test-tree-item><test-tree-item id="b2">B2</test-tree-item></test-tree-item>
        <test-tree-item id="c">C</test-tree-item>`;
    const items = Object.fromEntries(Array.from(host.querySelectorAll("test-tree-item"), item => [item.id, item as TestTreeItem]));
    configure(items);
    const internals = new TestInternals();
    const controller = new TreeViewController(host, internals, { isItem });
    controller.connect();
    controller.setItems(Array.from(host.children).filter(isItem));
    return { host, items, internals, controller };
}

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

const mutations = () => new Promise(resolve => setTimeout(resolve));

describe("TreeViewController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should give the element the tree role, and the items nested", () => {
        const { internals, items } = setup();

        expect(internals.role).to.equal("tree");
        expect(Object.values(items).every(item => item.nested)).to.be.true;
    });

    it("should have the selected item in the tab order, or the first", () => {
        const { items } = setup(items => {
            items.c.selected = true;
        });

        expect([items.a.tabIndex, items.c.tabIndex]).to.deep.equal([-1, 0]);
    });

    it("should move with Up and Down between the items shown, without wrapping, disabled ones too", () => {
        const { items } = setup(items => {
            items.b.disabled = true;
        });
        items.a.focus();

        press(items.a, "ArrowDown");
        expect(document.activeElement).to.equal(items.b);

        press(items.b, "ArrowDown");
        expect(document.activeElement, "b's items are collapsed").to.equal(items.c);

        press(items.c, "ArrowDown");
        expect(document.activeElement).to.equal(items.c);
    });

    it("should expand with Right, then move to the first item; collapse with Left, then move to the parent", () => {
        const { items } = setup();
        items.b.focus();

        press(items.b, "ArrowRight");
        expect(items.b.expanded).to.be.true;

        press(items.b, "ArrowRight");
        expect(document.activeElement).to.equal(items.b1);

        press(items.b1, "ArrowDown");
        expect(document.activeElement).to.equal(items.b2);

        press(items.b2, "ArrowLeft");
        expect(document.activeElement).to.equal(items.b);

        press(items.b, "ArrowLeft");
        expect(items.b.expanded).to.be.false;
    });

    it("should not expand a disabled item", () => {
        const { items } = setup(items => {
            items.b.disabled = true;
        });
        items.b.focus();

        press(items.b, "ArrowRight");

        expect(items.b.expanded).to.be.false;
    });

    it("should select an item with Enter and a click, emit change, and unselect the others", async () => {
        const { items } = setup();
        let changes = 0;
        items.c.addEventListener("change", () => changes++);
        items.a.focus();

        press(items.a, "Enter");
        items.c.click();
        await mutations();

        expect([items.a.selected, items.c.selected]).to.deep.equal([false, true]);
        expect(changes).to.equal(1);
    });

    it("should keep the item the user selects, not the last of those selected", () => {
        const { items } = setup(items => {
            items.c.selected = true;
        });
        items.a.focus();

        press(items.a, "Enter");

        expect([items.a.selected, items.c.selected]).to.deep.equal([true, false]);
    });

    it("should keep the last of several items selected at the start", () => {
        const { items } = setup(items => {
            items.a.selected = true;
            items.c.selected = true;
        });

        expect([items.a.selected, items.c.selected]).to.deep.equal([false, true]);
    });

    it("should unselect the others when an item is selected by code", async () => {
        const { items } = setup(items => {
            items.a.selected = true;
        });

        items.b1.selected = true;
        await mutations();

        expect([items.a.selected, items.b1.selected]).to.deep.equal([false, true]);
    });

    it("should not select a disabled item", () => {
        const { items } = setup(items => {
            items.a.disabled = true;
        });

        items.a.click();

        expect(items.a.selected).to.be.false;
    });
});

describe("tree item functions", () => {
    it("should toggle an item with items, emit toggle, and not one without", () => {
        const host = document.body.appendChild(new TestTreeItem());
        const child = host.appendChild(new TestTreeItem());
        let toggles = 0;
        host.addEventListener("toggle", () => toggles++);

        toggleTreeItem(host);
        toggleTreeItem(child);

        expect([host.expanded, child.expanded, toggles]).to.deep.equal([true, false, 1]);
    });

    it("should put the items in the item slot, and say an item is expanded only when it has items", () => {
        const host = document.body.appendChild(new TestTreeItem());
        const child = host.appendChild(new TestTreeItem());

        placeTreeItems(host.items);

        expect(child.slot).to.equal("item");
        expect(treeItemAria(host)).to.deep.equal({ role: "treeitem", ariaSelected: "false", ariaDisabled: null, ariaExpanded: "false" });
        expect(treeItemAria(child).ariaExpanded).to.be.null;
    });
});
