import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import type { SwitchElement } from "./switch.js";
import { SwitchController } from "./switch.controller.js";

const { expect } = chai;

class TestSwitch extends HTMLElement implements SwitchElement {
    public checked = false;
    public defaultChecked = false;
    public disabled = false;
    public required = false;
    public name: string | null = null;
    public value = "on";
    public readonly form: HTMLFormElement | null = null;
    public readonly labels: NodeList = document.createDocumentFragment().childNodes;
}
customElements.define("test-switch", TestSwitch);

function setup() {
    const host = document.body.appendChild(new TestSwitch());
    const internals = new TestInternals();
    const controller = new SwitchController(host, internals);
    controller.connect();
    return { host, internals, controller };
}

describe("SwitchController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should give the element the switch role", () => {
        const { internals } = setup();

        expect(internals.role).to.equal("switch");
    });

    it("should turn on and off on a click", () => {
        const { host, internals, controller } = setup();

        host.click();
        controller.stateChanged();
        expect(host.checked).to.be.true;
        expect(internals.ariaChecked).to.equal("true");

        host.click();
        expect(host.checked).to.be.false;
    });

    it("should be missing its value when it is required and off", () => {
        const { host, internals, controller } = setup();

        host.required = true;
        controller.stateChanged();

        expect(internals.validity).to.deep.equal({ valueMissing: true });
    });
});
