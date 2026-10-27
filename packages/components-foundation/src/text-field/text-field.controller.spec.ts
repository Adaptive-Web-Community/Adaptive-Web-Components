import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import { type TextFieldElement, TextFieldType } from "./text-field.js";
import { TextFieldController } from "./text-field.controller.js";

const { expect } = chai;

class TestTextField extends TestFormControl implements TextFieldElement {
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
    public type: TextFieldType = TextFieldType.text;
    public pattern: string | null = null;
}
customElements.define("test-text-field", TestTextField);

function setup(configure: (host: TestTextField) => void = () => {}) {
    const form = document.body.appendChild(document.createElement("form"));
    const host = form.appendChild(new TestTextField());
    configure(host);
    const control = host.attachShadow({ mode: "open" }).appendChild(document.createElement("input"));
    const internals = new TestInternals();
    internals.form = form;
    const controller = new TextFieldController(host, internals);
    controller.connect(control);
    return { form, host, control, internals, controller };
}

function type(control: HTMLInputElement, value: string): void {
    control.value = value;
    control.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
}

describe("TextFieldController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should write the attributes of the contract to the control", () => {
        const { control } = setup(host => {
            host.type = TextFieldType.email;
            host.placeholder = "name@example.com";
            host.maxLength = 40;
            host.required = true;
            host.readOnly = true;
            host.autocomplete = "email";
        });

        expect(control.type).to.equal("email");
        expect(control.getAttribute("placeholder")).to.equal("name@example.com");
        expect(control.getAttribute("maxlength")).to.equal("40");
        expect(control.required).to.be.true;
        expect(control.readOnly).to.be.true;
        expect(control.getAttribute("autocomplete")).to.equal("email");
    });

    it("should take the value the user types, and give it to the form", () => {
        const { host, control, internals } = setup();

        type(control, "Ada");

        expect(host.value).to.equal("Ada");
        expect(internals.formValue).to.equal("Ada");
    });

    it("should give the control a value set by code", () => {
        const { host, control, controller } = setup();

        host.value = "Grace";
        controller.valueChanged();

        expect(control.value).to.equal("Grace");
    });

    it("should emit change from the element", () => {
        const { host, control } = setup();
        let changes = 0;
        host.addEventListener("change", () => changes++);

        control.dispatchEvent(new Event("change"));

        expect(changes).to.equal(1);
    });

    describe("default", () => {
        it("should take the value attribute until the user types", () => {
            const { host, control, controller } = setup();

            host.defaultValue = "first";
            controller.defaultValueChanged();
            expect(host.value).to.equal("first");

            type(control, "typed");
            host.defaultValue = "second";
            controller.defaultValueChanged();
            expect(host.value).to.equal("typed");
        });

        it("should go back to the default when its form is reset", () => {
            const { host, control, controller } = setup(host => (host.defaultValue = "first"));
            controller.defaultValueChanged();
            type(control, "typed");

            controller.formReset();

            expect(host.value).to.equal("first");
            expect(control.value).to.equal("first");
        });
    });

    describe("validity", () => {
        it("should be the control's, shown at the control", () => {
            const { internals, control } = setup(host => (host.required = true));

            expect(internals.validity.valueMissing).to.be.true;
            expect(internals.validationAnchor).to.equal(control);
        });

        it("should be valid when the control is", () => {
            const { internals, control } = setup(host => (host.required = true));

            type(control, "Ada");

            expect(internals.validity).to.deep.equal({});
        });
    });

    it("should disable the control", () => {
        const { control, controller } = setup();

        controller.disabledChanged(true);

        expect(control.disabled).to.be.true;
    });

    it("should forward the author's ARIA to the control", () => {
        const { control } = setup(host => host.setAttribute("aria-describedby", "hint"));

        expect(control.hasAttribute("aria-describedby")).to.be.false;
        expect(control.ariaDescribedByElements).to.deep.equal([]);
    });

    it("should be labelled by an outside label", () => {
        const { control, internals, controller } = setup();
        const label = document.body.appendChild(document.createElement("label"));
        const labels = document.createElement("div");
        labels.appendChild(label);
        internals.labels = labels.childNodes;

        controller.labelsChanged();

        expect(control.ariaLabelledByElements).to.deep.equal([label]);
    });

    describe("Enter", () => {
        it("should click the form's submit button", () => {
            const { form, control } = setup();
            const button = form.appendChild(document.createElement("button"));
            let clicks = 0;
            button.addEventListener("click", event => {
                clicks++;
                event.preventDefault();
            });

            control.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

            expect(clicks).to.equal(1);
        });

        it("should submit a form without a submit button", () => {
            const { form, control } = setup();
            let submits = 0;
            form.addEventListener("submit", event => {
                submits++;
                event.preventDefault();
            });

            control.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

            expect(submits).to.equal(1);
        });
    });
});
