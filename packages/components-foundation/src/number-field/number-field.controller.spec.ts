import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import type { NumberFieldElement } from "./number-field.js";
import { NumberFieldController } from "./number-field.controller.js";

const { expect } = chai;

class TestNumberField extends TestFormControl implements NumberFieldElement {
    public label: string | null = null;
    public hideLabel = false;
    public value = "";
    public defaultValue = "";
    public disabled = false;
    public readOnly = false;
    public required = false;
    public name: string | null = null;
    public placeholder: string | null = null;
    public maxLength: number | null = null;
    public minLength: number | null = null;
    public autocomplete: string | null = null;
    public min: number | null = null;
    public max: number | null = null;
    public step: number | null = null;
    public hideStep = false;
    public stepUp(): void {}
    public stepDown(): void {}
}
customElements.define("test-number-field", TestNumberField);

function setup(configure: (host: TestNumberField) => void = () => {}) {
    const host = document.body.appendChild(new TestNumberField());
    configure(host);
    const control = host.attachShadow({ mode: "open" }).appendChild(document.createElement("input"));
    const internals = new TestInternals();
    const controller = new NumberFieldController(host, internals);
    controller.connect(control);
    return { host, control, internals, controller };
}

describe("NumberFieldController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should make the control a number input with its range and step", () => {
        const { control } = setup(host => Object.assign(host, { min: 0, max: 10, step: 2 }));

        expect(control.type).to.equal("number");
        expect(control.getAttribute("min")).to.equal("0");
        expect(control.getAttribute("max")).to.equal("10");
        expect(control.getAttribute("step")).to.equal("2");
    });

    it("should step up and down, as the user does", () => {
        const { host, internals, controller } = setup(host => Object.assign(host, { value: "4", step: 2 }));
        const fired: string[] = [];
        host.addEventListener("input", () => fired.push("input"));
        host.addEventListener("change", () => fired.push("change"));

        controller.stepUp();
        expect(host.value).to.equal("6");
        expect(internals.formValue).to.equal("6");
        expect(fired).to.deep.equal(["input", "change"]);

        controller.stepDown();
        controller.stepDown();
        expect(host.value).to.equal("2");
    });

    it("should stay in its range", () => {
        const { host, controller } = setup(host => Object.assign(host, { value: "10", max: 10 }));

        controller.stepUp();

        expect(host.value).to.equal("10");
    });

    it("should not step when it is read only", () => {
        const { host, controller } = setup(host => Object.assign(host, { value: "1", readOnly: true }));

        controller.stepUp();

        expect(host.value).to.equal("1");
    });

    it("should be out of range by the control's validity", () => {
        const { internals } = setup(host => Object.assign(host, { value: "20", max: 10 }));

        expect(internals.validity.rangeOverflow).to.be.true;
    });
});
