import chai from "chai";
import { type AccordionItemElement, type HeadingLevel, toggleAccordionItem } from "../accordion-item/accordion-item.js";
import { type AccordionElement, AccordionExpandMode } from "./accordion.js";
import { AccordionController } from "./accordion.controller.js";

const { expect } = chai;

let focused: AccordionItemElement | null = null;

class TestAccordionItem extends HTMLElement implements AccordionItemElement {
    public headingLevel: HeadingLevel = 2;
    public expanded = false;
    public disabled = false;
    public collapsible = true;

    public focus(): void {
        focused = this;
    }
}
customElements.define("test-accordion-item", TestAccordionItem);

class TestAccordion extends HTMLElement implements AccordionElement {
    public expandMode: AccordionExpandMode = AccordionExpandMode.multi;
}
customElements.define("test-accordion", TestAccordion);

function setup(count: number, expandMode: AccordionExpandMode = AccordionExpandMode.multi) {
    const host = new TestAccordion();
    host.expandMode = expandMode;
    const items = Array.from({ length: count }, () => host.appendChild(new TestAccordionItem()));
    document.body.append(host);
    const controller = new AccordionController(host);
    controller.connect();
    return { host, items, controller };
}

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

describe("AccordionController", () => {
    beforeEach(() => {
        focused = null;
        document.body.innerHTML = "";
    });

    describe("in the multi expand mode", () => {
        it("should keep the expanded items", () => {
            const { items, controller } = setup(3);
            items[0].expanded = true;
            items[2].expanded = true;

            controller.setItems(items);

            expect(items.map(item => item.expanded)).to.deep.equal([true, false, true]);
            expect(items.every(item => item.collapsible)).to.be.true;
        });

        it("should keep the others when an item is expanded", () => {
            const { items, controller } = setup(2);
            items[0].expanded = true;
            controller.setItems(items);

            items[1].expanded = true;
            controller.itemExpandedChanged(items[1]);

            expect(items.map(item => item.expanded)).to.deep.equal([true, true]);
        });
    });

    describe("in the single expand mode", () => {
        it("should expand the first item that isn't disabled when none is expanded", () => {
            const { items, controller } = setup(3, AccordionExpandMode.single);
            items[0].disabled = true;

            controller.setItems(items);

            expect(items.map(item => item.expanded)).to.deep.equal([false, true, false]);
        });

        it("should keep the first expanded item only", () => {
            const { items, controller } = setup(3, AccordionExpandMode.single);
            items[1].expanded = true;
            items[2].expanded = true;

            controller.setItems(items);

            expect(items.map(item => item.expanded)).to.deep.equal([false, true, false]);
        });

        it("should make the expanded item the one that isn't collapsible", () => {
            const { items, controller } = setup(2, AccordionExpandMode.single);

            controller.setItems(items);

            expect(items.map(item => item.collapsible)).to.deep.equal([false, true]);
        });

        it("should collapse the others when an item is expanded", () => {
            const { items, controller } = setup(3, AccordionExpandMode.single);
            controller.setItems(items);

            items[2].expanded = true;
            controller.itemExpandedChanged(items[2]);

            expect(items.map(item => item.expanded)).to.deep.equal([false, false, true]);
            expect(items.map(item => item.collapsible)).to.deep.equal([true, true, false]);
        });

        it("should do nothing when an item is collapsed", () => {
            const { items, controller } = setup(2, AccordionExpandMode.single);
            controller.setItems(items);

            items[0].expanded = false;
            controller.itemExpandedChanged(items[0]);

            expect(items.map(item => item.expanded)).to.deep.equal([false, false]);
        });

        it("should make every item collapsible when the mode changes to multi", () => {
            const { host, items, controller } = setup(2, AccordionExpandMode.single);
            controller.setItems(items);

            host.expandMode = AccordionExpandMode.multi;
            controller.expandModeChanged();

            expect(items.every(item => item.collapsible)).to.be.true;
            expect(items.map(item => item.expanded)).to.deep.equal([true, false]);
        });

        it("should keep one item expanded when the mode changes to single", () => {
            const { host, items, controller } = setup(3);
            items[1].expanded = true;
            items[2].expanded = true;
            controller.setItems(items);

            host.expandMode = AccordionExpandMode.single;
            controller.expandModeChanged();

            expect(items.map(item => item.expanded)).to.deep.equal([false, true, false]);
        });
    });

    describe("keyboard", () => {
        it("should move the focus to the next item with the down arrow, and wrap", () => {
            const { items, controller } = setup(3);
            controller.setItems(items);

            press(items[0], "ArrowDown");
            expect(focused).to.equal(items[1]);

            press(items[2], "ArrowDown");
            expect(focused).to.equal(items[0]);
        });

        it("should move the focus to the previous item with the up arrow, and wrap", () => {
            const { items, controller } = setup(3);
            controller.setItems(items);

            press(items[1], "ArrowUp");
            expect(focused).to.equal(items[0]);

            press(items[0], "ArrowUp");
            expect(focused).to.equal(items[2]);
        });

        it("should move the focus to the first item with Home and to the last with End", () => {
            const { items, controller } = setup(3);
            controller.setItems(items);

            press(items[1], "Home");
            expect(focused).to.equal(items[0]);

            press(items[1], "End");
            expect(focused).to.equal(items[2]);
        });

        it("should skip the disabled items", () => {
            const { items, controller } = setup(3);
            items[1].disabled = true;
            controller.setItems(items);

            press(items[0], "ArrowDown");
            expect(focused).to.equal(items[2]);
        });

        it("should prevent the default of the keys it handles only", () => {
            const { items, controller } = setup(2);
            controller.setItems(items);

            expect(press(items[0], "ArrowDown").defaultPrevented).to.be.true;
            expect(press(items[0], "a").defaultPrevented).to.be.false;
        });

        it("should ignore a key in the panel of an item", () => {
            const { items, controller } = setup(2);
            controller.setItems(items);
            const content = items[0].appendChild(document.createElement("input"));

            const event = press(content, "ArrowDown");

            expect(focused).to.be.null;
            expect(event.defaultPrevented).to.be.false;
        });

        it("should ignore a key that was handled already", () => {
            const { items, controller } = setup(2);
            controller.setItems(items);
            items[0].addEventListener("keydown", event => event.preventDefault());

            press(items[0], "ArrowDown");

            expect(focused).to.be.null;
        });

        it("should stop handling the keyboard when disconnected", () => {
            const { items, controller } = setup(2);
            controller.setItems(items);

            controller.disconnect();
            press(items[0], "ArrowDown");

            expect(focused).to.be.null;
        });
    });
});

describe("toggleAccordionItem", () => {
    it("should expand and collapse the item, and emit a change that bubbles", () => {
        const item = new TestAccordionItem();
        let changes = 0;
        document.body.addEventListener("change", () => changes++);
        document.body.append(item);

        toggleAccordionItem(item);
        expect(item.expanded).to.be.true;

        toggleAccordionItem(item);
        expect(item.expanded).to.be.false;
        expect(changes).to.equal(2);
    });

    it("should do nothing when the item is disabled", () => {
        const item = new TestAccordionItem();
        item.disabled = true;

        toggleAccordionItem(item);

        expect(item.expanded).to.be.false;
    });

    it("should not collapse an expanded item that isn't collapsible", () => {
        const item = new TestAccordionItem();
        item.expanded = true;
        item.collapsible = false;

        toggleAccordionItem(item);

        expect(item.expanded).to.be.true;
    });
});
