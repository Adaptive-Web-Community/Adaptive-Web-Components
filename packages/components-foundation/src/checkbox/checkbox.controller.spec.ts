import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import type { CheckboxElement } from "./checkbox.js";
import { CheckboxController } from "./checkbox.controller.js";

const { expect } = chai;

class TestCheckbox extends HTMLElement implements CheckboxElement {
    public checked = false;
    public defaultChecked = false;
    public disabled = false;
    public indeterminate = false;
    public required = false;
    public name: string | null = null;
    public value = "on";
    public readonly form: HTMLFormElement | null = null;
    public readonly labels: NodeList = document.createDocumentFragment().childNodes;
}
customElements.define("test-checkbox", TestCheckbox);

function setup() {
    const host = document.body.appendChild(new TestCheckbox());
    const internals = new TestInternals();
    const controller = new CheckboxController(host, internals);
    controller.connect();
    return { host, internals, controller };
}

function events(host: HTMLElement): string[] {
    const fired: string[] = [];
    host.addEventListener("input", () => fired.push("input"));
    host.addEventListener("change", () => fired.push("change"));
    return fired;
}

function key(host: HTMLElement, type: "keydown" | "keyup", key: string): void {
    host.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true, cancelable: true }));
}

describe("CheckboxController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should give the element the checkbox role, and make it focusable", () => {
        const { host, internals } = setup();

        expect(internals.role).to.equal("checkbox");
        expect(host.getAttribute("tabindex")).to.equal("0");
    });

    it("should check and uncheck on a click, and emit input and change", () => {
        const { host, internals } = setup();
        const fired = events(host);

        host.click();
        expect(host.checked).to.be.true;
        expect(fired).to.deep.equal(["input", "change"]);

        host.click();
        expect(host.checked).to.be.false;
    });

    it("should check when Space is released", () => {
        const { host, internals } = setup();

        key(host, "keydown", " ");
        expect(internals.states.has("active")).to.be.true;
        expect(host.checked).to.be.false;

        key(host, "keyup", " ");
        expect(host.checked).to.be.true;
    });

    it("should not check on a click that was cancelled", () => {
        const { host } = setup();
        host.addEventListener("click", event => event.preventDefault(), { capture: true });

        host.click();

        expect(host.checked).to.be.false;
    });

    it("should show the checked state, and give its value to the form when checked", () => {
        const { host, internals, controller } = setup();
        host.value = "yes";

        host.checked = true;
        controller.stateChanged();
        expect(internals.ariaChecked).to.equal("true");
        expect(internals.states.has("checked")).to.be.true;
        expect(internals.formValue).to.equal("yes");

        host.checked = false;
        controller.stateChanged();
        expect(internals.ariaChecked).to.equal("false");
        expect(internals.states.has("checked")).to.be.false;
        expect(internals.formValue).to.be.null;
    });

    describe("default", () => {
        it("should be checked by the checked attribute until the user checks it", () => {
            const { host, controller } = setup();

            host.defaultChecked = true;
            controller.defaultCheckedChanged();
            expect(host.checked).to.be.true;

            host.click();
            host.defaultChecked = false;
            controller.defaultCheckedChanged();
            expect(host.checked).to.be.false;

            host.defaultChecked = true;
            controller.defaultCheckedChanged();
            expect(host.checked).to.be.false;
        });

        it("should go back to the default when its form is reset", () => {
            const { host, controller } = setup();
            host.defaultChecked = true;
            controller.defaultCheckedChanged();
            host.click();

            controller.formReset();
            expect(host.checked).to.be.true;

            host.defaultChecked = false;
            controller.defaultCheckedChanged();
            expect(host.checked).to.be.false;
        });
    });

    describe("indeterminate", () => {
        it("should be mixed, with the indeterminate state", () => {
            const { host, internals, controller } = setup();

            host.indeterminate = true;
            controller.stateChanged();

            expect(internals.ariaChecked).to.equal("mixed");
            expect(internals.states.has("indeterminate")).to.be.true;
        });

        it("should end when the user checks it", () => {
            const { host, internals, controller } = setup();
            host.indeterminate = true;
            controller.stateChanged();

            host.click();
            controller.stateChanged();

            expect(host.indeterminate).to.be.false;
            expect(host.checked).to.be.true;
            expect(internals.ariaChecked).to.equal("true");
        });
    });

    describe("required", () => {
        it("should be missing its value when it isn't checked", () => {
            const { host, internals, controller } = setup();

            host.required = true;
            controller.stateChanged();

            expect(internals.validity).to.deep.equal({ valueMissing: true });
            expect(internals.ariaRequired).to.equal("true");
        });

        it("should be valid when it is checked, or not required", () => {
            const { host, internals, controller } = setup();
            host.required = true;
            host.checked = true;
            controller.stateChanged();
            expect(internals.validity).to.deep.equal({});

            host.required = false;
            host.checked = false;
            controller.stateChanged();
            expect(internals.validity).to.deep.equal({});
            expect(internals.ariaRequired).to.be.null;
        });
    });

    it("should stop handling clicks when disconnected", () => {
        const { host, controller } = setup();

        controller.disconnect();
        host.click();

        expect(host.checked).to.be.false;
    });
});
