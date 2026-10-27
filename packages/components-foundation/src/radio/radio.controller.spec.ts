import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import type { RadioElement } from "./radio.js";
import { RadioController } from "./radio.controller.js";

const { expect } = chai;

class TestRadio extends TestFormControl implements RadioElement {
    public checked = false;
    public defaultChecked = false;
    public disabled = false;
    public groupReadOnly = false;
    public name: string | null = null;
    public value = "on";
}
customElements.define("test-radio-alone", TestRadio);

function setup() {
    const host = document.body.appendChild(new TestRadio());
    const internals = new TestInternals();
    const controller = new RadioController(host, internals);
    controller.connect();
    return { host, internals, controller };
}

describe("RadioController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should give the element the radio role", () => {
        const { internals } = setup();

        expect(internals.role).to.equal("radio");
    });

    it("should check on a click, and emit input and change", () => {
        const { host } = setup();
        const fired: string[] = [];
        host.addEventListener("change", () => fired.push("change"));

        host.click();

        expect(host.checked).to.be.true;
        expect(fired).to.deep.equal(["change"]);
    });

    it("should stay checked on a click when it is checked, without an event", () => {
        const { host } = setup();
        host.checked = true;
        let changes = 0;
        host.addEventListener("change", () => changes++);

        host.click();

        expect(host.checked).to.be.true;
        expect(changes).to.equal(0);
    });

    it("should give its value to the form when it is checked", () => {
        const { host, internals, controller } = setup();
        host.value = "small";

        host.click();
        controller.stateChanged();

        expect(internals.formValue).to.equal("small");
        expect(internals.ariaChecked).to.equal("true");
    });
});
