import chai from "chai";
import { AriaForwardingController } from "./aria-forwarding.controller.js";

const { expect } = chai;

// MutationObserver records are delivered in a microtask.
const mutations = () => new Promise(resolve => setTimeout(resolve));

function setup() {
    const host = document.body.appendChild(document.createElement("div"));
    const target = document.createElement("a");
    const controller = new AriaForwardingController(host);
    return { host, target, controller };
}

describe("AriaForwardingController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should forward the ARIA attributes the host has when it connects", () => {
        const { host, target, controller } = setup();
        host.setAttribute("aria-label", "Home");
        host.setAttribute("aria-current", "page");
        host.setAttribute("title", "Not ARIA");

        controller.connect(target);

        expect(target.getAttribute("aria-label")).to.equal("Home");
        expect(target.getAttribute("aria-current")).to.equal("page");
        expect(target.hasAttribute("title")).to.be.false;
    });

    it("should forward a change, and a removal", async () => {
        const { host, target, controller } = setup();
        controller.connect(target);

        host.setAttribute("aria-label", "Home");
        await mutations();
        expect(target.getAttribute("aria-label")).to.equal("Home");

        host.removeAttribute("aria-label");
        await mutations();
        expect(target.hasAttribute("aria-label")).to.be.false;
    });

    it("should forward ids as the elements, found where the host is", () => {
        const { host, target, controller } = setup();
        const first = document.body.appendChild(document.createElement("p"));
        first.id = "first";
        const second = document.body.appendChild(document.createElement("p"));
        second.id = "second";
        host.setAttribute("aria-describedby", " first missing second ");

        controller.connect(target);

        expect(target.ariaDescribedByElements).to.deep.equal([first, second]);
        expect(target.hasAttribute("aria-describedby")).to.be.false;
    });

    it("should clear the elements when the attribute is removed", async () => {
        const { host, target, controller } = setup();
        host.setAttribute("aria-labelledby", "label");
        controller.connect(target);

        host.removeAttribute("aria-labelledby");
        await mutations();

        expect(target.ariaLabelledByElements).to.be.null;
    });

    it("should stop forwarding when disconnected", async () => {
        const { host, target, controller } = setup();
        controller.connect(target);

        controller.disconnect();
        host.setAttribute("aria-label", "Home");
        await mutations();

        expect(target.hasAttribute("aria-label")).to.be.false;
    });
});
