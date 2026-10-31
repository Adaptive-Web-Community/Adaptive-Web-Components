import chai from "chai";
import { type AccordionItemElement, type HeadingLevel } from "./accordion-item.js";
import { AccordionItemParts } from "./accordion-item.generated.js";
import { AccordionItemController } from "./accordion-item.controller.js";

const { expect } = chai;

class TestAccordionItem extends HTMLElement implements AccordionItemElement {
    public headingLevel: HeadingLevel = 2;
    public expanded = false;
    public disabled = false;
    public collapsible = true;
}
customElements.define("test-accordion-item-controller", TestAccordionItem);

function setup() {
    const host = new TestAccordionItem();
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<button part="${AccordionItemParts.button}"><slot name="heading"></slot></button><span part="${AccordionItemParts.icon}"></span>`;
    document.body.append(host);
    const controller = new AccordionItemController(host, () => host.shadowRoot);
    controller.connect();
    const part = (name: string) => root.querySelector<HTMLElement>(`[part="${name}"]`);
    return { host, controller, part };
}

describe("AccordionItemController", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("toggles the item when its button is clicked", () => {
        const { host, part } = setup();
        let changes = 0;
        host.addEventListener("change", () => changes++);

        part(AccordionItemParts.button)?.click();
        expect(host.expanded).to.equal(true);

        part(AccordionItemParts.button)?.click();
        expect(host.expanded).to.equal(false);
        expect(changes).to.equal(2);
    });

    it("doesn't toggle the item when another part is clicked", () => {
        const { host, part } = setup();
        part(AccordionItemParts.icon)?.click();

        expect(host.expanded).to.equal(false);
    });

    it("doesn't toggle the item after it is disconnected", () => {
        const { host, controller, part } = setup();
        controller.disconnect();
        part(AccordionItemParts.button)?.click();

        expect(host.expanded).to.equal(false);
    });

    it("focuses the button", () => {
        const { host, controller, part } = setup();
        controller.focus();

        expect(host.shadowRoot?.activeElement).to.equal(part(AccordionItemParts.button));
    });
});
