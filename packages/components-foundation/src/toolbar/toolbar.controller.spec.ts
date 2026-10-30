import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import { Orientation } from "../utilities/orientation.js";
import type { ToolbarElement } from "./toolbar.js";
import { ToolbarController } from "./toolbar.controller.js";

const { expect } = chai;

class TestToolbar extends HTMLElement implements ToolbarElement {
    public orientation: Orientation = Orientation.horizontal;
}
customElements.define("test-toolbar", TestToolbar);

// A component whose focusable part is in its shadow root, without delegating its focus: its host isn't focusable.
class TestWrapper extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }).appendChild(document.createElement("button"));
    }
}
customElements.define("test-toolbar-wrapper", TestWrapper);

// A component that delegates its focus to a native element in its shadow root, such as a link. JSDOM keeps no `delegatesFocus`, so the
// shadow root has it here.
class TestLink extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: "open", delegatesFocus: true });
        Object.defineProperty(root, "delegatesFocus", { value: true });
        root.appendChild(document.createElement("a")).href = "#";
    }
}
customElements.define("test-toolbar-link", TestLink);

function setup(markup: string) {
    const host = document.body.appendChild(new TestToolbar());
    host.innerHTML = markup;
    const internals = new TestInternals();
    const controller = new ToolbarController(host, internals);
    controller.connect();
    controller.setElements(Array.from(host.children));
    return { host, internals, controller, elements: Array.from(host.children) as HTMLElement[] };
}

function press(target: EventTarget, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, composed: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

const tabIndexes = (elements: HTMLElement[]) => elements.map(element => element.tabIndex);

describe("ToolbarController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should give the element the toolbar role, in its orientation", () => {
        const { host, internals, controller } = setup("");

        expect(internals.role).to.equal("toolbar");
        expect(internals.ariaOrientation).to.equal("horizontal");

        host.orientation = Orientation.vertical;
        controller.orientationChanged();
        expect(internals.ariaOrientation).to.equal("vertical");
    });

    it("should name the toolbar by its label", () => {
        const { internals, controller } = setup("");
        const label = document.createElement("span");

        controller.labelsChanged([label]);

        expect(internals.ariaLabelledByElements).to.deep.equal([label]);
    });

    it("should have the first item in the tab order", () => {
        const { elements } = setup(`<button>a</button><span tabindex="0">b</span><button>c</button>`);

        expect(tabIndexes(elements)).to.deep.equal([0, -1, -1]);
    });

    it("should leave out what isn't focusable itself", () => {
        const { elements } = setup(`<button>a</button><span>text</span><test-toolbar-wrapper></test-toolbar-wrapper><button hidden>b</button>`);

        expect(tabIndexes(elements)).to.deep.equal([0, -1, -1, 0]);
        press(elements[0], "ArrowRight");
        expect(document.activeElement).to.equal(elements[0]);
    });

    it("should take an element that delegates its focus as an item", () => {
        const { elements } = setup(`<button>a</button><test-toolbar-link></test-toolbar-link>`);

        expect(elements[1].getAttribute("tabindex")).to.equal("-1");
        press(elements[0], "ArrowRight");
        expect(document.activeElement).to.equal(elements[1]);
    });

    it("should find the items in a plain element around them, and not in a custom element", () => {
        const { host, elements } = setup(`<button>a</button><label><input type="checkbox"> b</label><test-toolbar-wrapper></test-toolbar-wrapper>`);
        const checkbox = host.querySelector("input")!;

        press(elements[0], "ArrowRight");
        expect(document.activeElement).to.equal(checkbox);

        press(checkbox, "ArrowRight");
        expect(document.activeElement).to.equal(elements[0]);
    });

    it("should move the focus with the arrows of its orientation, wrapping, and with Home and End", () => {
        const { elements } = setup(`<button>a</button><button>b</button><button>c</button>`);

        press(elements[0], "ArrowRight");
        expect(document.activeElement).to.equal(elements[1]);
        expect(tabIndexes(elements)).to.deep.equal([-1, 0, -1]);

        press(elements[1], "ArrowDown");
        expect(document.activeElement).to.equal(elements[1]);

        press(elements[1], "End");
        expect(document.activeElement).to.equal(elements[2]);

        press(elements[2], "ArrowRight");
        expect(document.activeElement).to.equal(elements[0]);
    });

    it("should skip a disabled item", () => {
        const { elements } = setup(`<button>a</button><button disabled>b</button><button>c</button>`);

        press(elements[0], "ArrowRight");

        expect(document.activeElement).to.equal(elements[2]);
    });

    it("should make an item that gets the focus by a click the one in the tab order", () => {
        const { elements } = setup(`<button>a</button><button>b</button>`);

        elements[1].focus();

        expect(tabIndexes(elements)).to.deep.equal([-1, 0]);
    });

    it("should not take the keys of a text that the user edits", () => {
        const { elements } = setup(`<input tabindex="0"><button>b</button>`);

        const event = press(elements[0], "ArrowRight");

        expect(event.defaultPrevented).to.be.false;
        expect(document.activeElement).to.not.equal(elements[1]);
    });

    it("should take the keys of an input that isn't text", () => {
        const { elements } = setup(`<input type="checkbox"><button>b</button>`);

        press(elements[0], "ArrowRight");

        expect(document.activeElement).to.equal(elements[1]);
    });
});
