import chai from "chai";
import type { TabPanelElement } from "../tab-panel/tab-panel.js";
import { tabPanelAria } from "../tab-panel/tab-panel.js";
import { selectTab, tabAria, type TabElement } from "../tab/tab.js";
import { Orientation } from "../utilities/orientation.js";
import { TestInternals } from "../__test__/internals.js";
import type { TablistElement } from "./tablist.js";
import { TablistController } from "./tablist.controller.js";

const { expect } = chai;

// A binding observes `selected` and tells the tablist; this stands in for it.
let tabs: TablistController | null = null;

class TestTab extends HTMLElement implements TabElement {
    private _selected = false;
    public disabled = false;
    public panel: TabPanelElement | null = null;

    public get selected(): boolean {
        return this._selected;
    }
    public set selected(selected: boolean) {
        if (selected !== this._selected) {
            this._selected = selected;
            tabs?.tabSelectedChanged(this);
        }
    }
}
customElements.define("test-tab", TestTab);

class TestTabPanel extends HTMLElement implements TabPanelElement {
    public tab: TabElement | null = null;
}
customElements.define("test-tab-panel", TestTabPanel);

class TestTablist extends HTMLElement implements TablistElement {
    public orientation: Orientation = Orientation.horizontal;
    public panelsElement: Element | null = null;
}
customElements.define("test-tablist", TestTablist);

const isPanel = (element: Element): element is TestTabPanel => element instanceof TestTabPanel;

function setup(count: number, panelCount: number = count, configure: (tabs: TestTab[]) => void = () => {}) {
    const host = document.body.appendChild(new TestTablist());
    const items = Array.from({ length: count }, () => host.appendChild(new TestTab()));
    const container = document.body.appendChild(document.createElement("div"));
    const panels = Array.from({ length: panelCount }, () => container.appendChild(new TestTabPanel()));
    host.panelsElement = container;
    configure(items);
    const internals = new TestInternals();
    const controller = new TablistController(host, internals, { isPanel, registry: customElements });
    tabs = controller;
    controller.connect();
    controller.setTabs(items);
    return { host, items, container, panels, internals, controller };
}

const mutations = () => new Promise(resolve => setTimeout(resolve));

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

const selected = (items: TestTab[]) => items.map(tab => tab.selected);
const hidden = (panels: TestTabPanel[]) => panels.map(panel => panel.hidden);
const tabIndexes = (items: HTMLElement[]) => items.map(item => item.tabIndex);

describe("TablistController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        tabs = null;
    });

    it("should give the element the tablist role, in its orientation", () => {
        const { host, internals, controller } = setup(1);

        expect(internals.role).to.equal("tablist");
        expect(internals.ariaOrientation).to.equal("horizontal");

        host.orientation = Orientation.vertical;
        controller.orientationChanged();
        expect(internals.ariaOrientation).to.equal("vertical");
    });

    it("should pair the tabs with the panels of the panels' element in order", () => {
        const { items, panels } = setup(2, 3);

        expect(items.map(tab => tab.panel)).to.deep.equal(panels.slice(0, 2));
        expect(panels.map(panel => panel.tab)).to.deep.equal([...items, null]);
    });

    it("should pair the tabs again when the panels change, leaving out what isn't a panel", async () => {
        const { items, container, panels } = setup(2, 1);

        container.appendChild(document.createElement("p"));
        const added = container.appendChild(new TestTabPanel());
        await mutations();

        expect(items.map(tab => tab.panel)).to.deep.equal([panels[0], added]);
        expect(added.hidden).to.be.true;
    });

    it("should pair the tabs with another panels' element", () => {
        const { host, items, controller } = setup(1, 1);
        const other = document.body.appendChild(document.createElement("div"));
        const panel = other.appendChild(new TestTabPanel());

        host.panelsElement = other;
        controller.panelsElementChanged();

        expect(items[0].panel).to.equal(panel);
    });

    describe("selected", () => {
        it("should select the first tab that isn't disabled when none is selected, and show its panel only", () => {
            const { items, panels } = setup(3, 3, items => {
                items[0].disabled = true;
            });

            expect(selected(items)).to.deep.equal([false, true, false]);
            expect(hidden(panels)).to.deep.equal([true, false, true]);
        });

        it("should keep the last of several selected tabs", () => {
            const { items } = setup(3, 3, items => {
                items[0].selected = true;
                items[2].selected = true;
            });

            expect(selected(items)).to.deep.equal([false, false, true]);
        });

        it("should not keep a selected tab that is disabled", () => {
            const { items } = setup(2, 2, items => {
                items[1].selected = true;
                items[1].disabled = true;
            });

            expect(selected(items)).to.deep.equal([true, false]);
        });

        it("should unselect the others when a tab is selected by code, and show its panel", () => {
            const { items, panels } = setup(3);

            items[2].selected = true;

            expect(selected(items)).to.deep.equal([false, false, true]);
            expect(hidden(panels)).to.deep.equal([true, true, false]);
        });

        it("should hide a panel without a tab", () => {
            const { panels } = setup(1, 2);

            expect(hidden(panels)).to.deep.equal([false, true]);
        });
    });

    describe("focus", () => {
        it("should have the selected tab in the tab order", () => {
            const { items } = setup(3);

            items[1].selected = true;

            expect(tabIndexes(items)).to.deep.equal([-1, 0, -1]);
        });
    });

    describe("keyboard", () => {
        it("should move to the next tab with Right in the horizontal orientation, and select it", () => {
            const { items } = setup(3);
            let changes = 0;
            items[1].addEventListener("change", () => changes++);

            const event = press(items[0], "ArrowRight");

            expect(event.defaultPrevented).to.be.true;
            expect(document.activeElement).to.equal(items[1]);
            expect(selected(items)).to.deep.equal([false, true, false]);
            expect(changes).to.equal(1);
        });

        it("should not move with Down in the horizontal orientation", () => {
            const { items } = setup(2);

            const event = press(items[0], "ArrowDown");

            expect(event.defaultPrevented).to.be.false;
            expect(selected(items)).to.deep.equal([true, false]);
        });

        it("should move with Down in the vertical orientation", () => {
            const { host, items, controller } = setup(2);
            host.orientation = Orientation.vertical;
            controller.orientationChanged();

            press(items[0], "ArrowDown");

            expect(selected(items)).to.deep.equal([false, true]);
        });

        it("should wrap, and skip a disabled tab", () => {
            const { items } = setup(3, 3, items => {
                items[0].disabled = true;
            });

            press(items[1], "ArrowRight");
            press(items[2], "ArrowRight");

            expect(document.activeElement).to.equal(items[1]);
        });

        it("should move to the first and the last tab with Home and End", () => {
            const { items } = setup(3);

            press(items[0], "End");
            expect(selected(items)).to.deep.equal([false, false, true]);

            press(items[2], "Home");
            expect(selected(items)).to.deep.equal([true, false, false]);
        });

        it("should not handle a key of what isn't a tab", () => {
            const { host } = setup(2);
            const other = host.appendChild(document.createElement("button"));

            const event = press(other, "ArrowRight");

            expect(event.defaultPrevented).to.be.false;
        });
    });
});

describe("selectTab", () => {
    beforeEach(() => {
        tabs = null;
    });

    it("should select the tab, and emit change", () => {
        const tab = new TestTab();
        let changes = 0;
        tab.addEventListener("change", () => changes++);

        selectTab(tab);
        selectTab(tab);

        expect(tab.selected).to.be.true;
        expect(changes).to.equal(1);
    });

    it("should not select a disabled tab", () => {
        const tab = new TestTab();
        tab.disabled = true;

        selectTab(tab);

        expect(tab.selected).to.be.false;
    });
});

describe("tabAria and tabPanelAria", () => {
    it("should link a tab and its panel", () => {
        const tab = new TestTab();
        const panel = new TestTabPanel();
        tab.panel = panel;
        panel.tab = tab;
        tab.disabled = true;

        expect(tabAria(tab)).to.deep.equal({
            role: "tab",
            ariaSelected: "false",
            ariaDisabled: "true",
            ariaControlsElements: [panel],
        });
        expect(tabPanelAria(panel)).to.deep.equal({ role: "tabpanel", ariaLabelledByElements: [tab] });
    });
});
