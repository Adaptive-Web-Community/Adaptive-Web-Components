import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import { TestPopover } from "../__test__/popover.js";
import { type MenuItemElement, type MenuItemStartColumns, MenuItemType } from "../menu-item/menu-item.js";
import { MenuItemController } from "../menu-item/menu-item.controller.js";
import { MenuController } from "./menu.controller.js";

const { expect } = chai;

// A binding observes `checked` and tells the menu; this stands in for it.
let checkedChanged: ((item: TestMenuItem) => void) | null = null;

class TestMenuItem extends HTMLElement implements MenuItemElement {
    private _checked = false;
    public type: MenuItemType = MenuItemType.item;
    public disabled = false;
    public submenu: HTMLElement | null = null;
    public startColumns: MenuItemStartColumns = 0;
    public readonly internals = new TestInternals();
    public readonly controller = new MenuItemController(this, this.internals);

    public get checked(): boolean {
        return this._checked;
    }
    public set checked(checked: boolean) {
        if (checked !== this._checked) {
            this._checked = checked;
            this.controller.stateChanged();
            checkedChanged?.(this);
        }
    }
}
customElements.define("test-menu-item", TestMenuItem);

class TestMenu extends TestPopover {}
customElements.define("test-menu", TestMenu);

const isItem = (element: Element): element is TestMenuItem => element instanceof TestMenuItem;

function createMenu(parent: Element, spec: string): { menu: TestMenu; items: TestMenuItem[]; controller: MenuController } {
    const menu = parent.appendChild(new TestMenu());
    // Each letter is an item: i an item, c a checkbox, r a radio; | a divider.
    for (const kind of spec) {
        if (kind === "|") {
            menu.appendChild(document.createElement("hr"));
            continue;
        }
        const item = menu.appendChild(new TestMenuItem());
        item.type = kind === "c" ? MenuItemType.checkbox : kind === "r" ? MenuItemType.radio : MenuItemType.item;
        item.controller.connect();
    }
    const controller = new MenuController(menu, new TestInternals(), { isItem });
    controller.connect();
    controller.setElements(Array.from(menu.children));
    return { menu, items: Array.from(menu.children).filter(isItem), controller };
}

function setup(spec: string) {
    const result = createMenu(document.body, spec);
    checkedChanged = item => result.controller.itemCheckedChanged(item);
    return result;
}

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

describe("MenuController and MenuItemController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        checkedChanged = null;
    });

    it("should give the menu and its items their roles", () => {
        const { items } = setup("icr");

        expect(items.map(item => item.internals.role)).to.deep.equal(["menuitem", "menuitemcheckbox", "menuitemradio"]);
        expect(items.map(item => item.internals.ariaChecked)).to.deep.equal([null, "false", "false"]);
    });

    it("should focus the first item when it opens", () => {
        const { menu, items } = setup("ii");

        menu.showPopover();

        expect(document.activeElement).to.equal(items[0]);
        expect(items.map(item => item.tabIndex)).to.deep.equal([0, -1]);
    });

    it("should move the focus with Up and Down to disabled items too, and with Home and End", () => {
        const { menu, items } = setup("iii");
        items[1].disabled = true;
        menu.showPopover();

        press(items[0], "ArrowDown");
        expect(document.activeElement).to.equal(items[1]);

        press(items[1], "End");
        expect(document.activeElement).to.equal(items[2]);
    });

    it("should close when an item that does something is activated, and emit its click", () => {
        const { menu, items } = setup("ii");
        let clicks = 0;
        items[1].addEventListener("click", () => clicks++);
        menu.showPopover();

        press(items[1], "Enter");

        expect(clicks).to.equal(1);
        expect(menu.open).to.be.false;
    });

    it("should not activate a disabled item, nor close", () => {
        const { menu, items } = setup("ic");
        items[1].disabled = true;
        items[1].controller.stateChanged();
        let clicks = 0;
        items[1].addEventListener("click", () => clicks++);
        menu.showPopover();

        items[1].click();

        expect(clicks).to.equal(0);
        expect(items[1].checked).to.be.false;
        expect(menu.open).to.be.true;
        expect(items[1].internals.ariaDisabled).to.equal("true");
    });

    it("should toggle a checkbox item, emit change, and stay open", () => {
        const { menu, items } = setup("c");
        let changes = 0;
        items[0].addEventListener("change", () => changes++);
        menu.showPopover();

        items[0].click();

        expect(items[0].checked).to.be.true;
        expect(items[0].internals.ariaChecked).to.equal("true");
        expect(items[0].internals.states.has("checked")).to.be.true;
        expect(changes).to.equal(1);
        expect(menu.open).to.be.true;
    });

    it("should check one radio item of each group of radio items next to each other", () => {
        const { items } = setup("rr|rr");

        items[0].click();
        items[1].click();
        items[2].click();

        expect(items.map(item => item.checked)).to.deep.equal([false, true, true, false]);
    });

    it("should give the focus back to what opened it when it closes with the focus in it", () => {
        const { menu, items } = setup("i");
        const button = document.body.appendChild(document.createElement("button"));
        button.focus();
        menu.showPopover();

        press(items[0], "Enter");

        expect(document.activeElement).to.equal(button);
    });

    it("should close on Tab", () => {
        const { menu, items } = setup("i");
        menu.showPopover();

        press(items[0], "Tab");

        expect(menu.open).to.be.false;
    });

    it("should give its items the columns before their content", () => {
        const { items } = setup("ic");
        expect(items.map(item => item.startColumns)).to.deep.equal([1, 1]);
        expect(items[0].internals.states.has("start-columns-1")).to.be.false;

        items[0].controller.stateChanged();
        expect(items[0].internals.states.has("start-columns-1")).to.be.true;
    });

    describe("submenu", () => {
        function setupSubmenu() {
            const outer = setup("ii");
            const parent = outer.items[0];
            const inner = createMenu(parent, "ii");
            parent.submenu = inner.menu;
            parent.controller.submenuChanged();
            outer.menu.showPopover();
            return { ...outer, parent, inner };
        }

        it("should be a popover, and say that the item has it", () => {
            const { parent, inner } = setupSubmenu();

            expect(inner.menu.popover).to.equal("auto");
            expect(parent.internals.ariaHasPopup).to.equal("menu");
            expect(parent.internals.ariaExpanded).to.equal("false");
        });

        it("should open with Right, anchored to the item, with the focus on its first item", () => {
            const { parent, inner } = setupSubmenu();

            press(parent, "ArrowRight");

            expect(inner.menu.open).to.be.true;
            expect(inner.menu.source).to.equal(parent);
            expect(document.activeElement).to.equal(inner.items[0]);
            expect(parent.internals.ariaExpanded).to.equal("true");
        });

        it("should close with Left, with the focus back on the item", () => {
            const { parent, inner } = setupSubmenu();
            press(parent, "ArrowRight");

            press(inner.items[0], "ArrowLeft");

            expect(inner.menu.open).to.be.false;
            expect(document.activeElement).to.equal(parent);
        });

        it("should close all the menus when an item of the submenu that does something is activated", () => {
            const { menu, parent, inner } = setupSubmenu();
            press(parent, "ArrowRight");

            inner.items[1].click();

            expect(inner.menu.open).to.be.false;
            expect(menu.open).to.be.false;
        });

        it("should close when the focus moves to another item of the menu", () => {
            const { items, parent, inner } = setupSubmenu();
            press(parent, "ArrowRight");

            items[1].focus();

            expect(inner.menu.open).to.be.false;
        });

        it("should not move the focus of the outer menu with the keys of the submenu", () => {
            const { parent, inner } = setupSubmenu();
            press(parent, "ArrowRight");

            press(inner.items[0], "ArrowDown");

            expect(document.activeElement).to.equal(inner.items[1]);
        });
    });
});
