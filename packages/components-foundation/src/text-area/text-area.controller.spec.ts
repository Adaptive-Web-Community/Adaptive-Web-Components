import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import { type TextAreaElement, TextAreaResize } from "./text-area.js";
import { TextAreaController } from "./text-area.controller.js";

const { expect } = chai;

class TestTextArea extends TestFormControl implements TextAreaElement {
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
    public rows: number | null = 4;
    public cols: number | null = null;
    public resize: TextAreaResize = TextAreaResize.none;
}
customElements.define("test-text-area", TestTextArea);

function setup() {
    const form = document.body.appendChild(document.createElement("form"));
    const host = form.appendChild(new TestTextArea());
    const control = host.attachShadow({ mode: "open" }).appendChild(document.createElement("textarea"));
    const internals = new TestInternals();
    internals.form = form;
    const controller = new TextAreaController(host, internals);
    controller.connect(control);
    return { form, host, control, internals, controller };
}

describe("TextAreaController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should write its rows and columns to the control", () => {
        const { control } = setup();

        expect(control.getAttribute("rows")).to.equal("4");
        expect(control.hasAttribute("cols")).to.be.false;
    });

    it("should take the lines the user types", () => {
        const { host, control, internals } = setup();

        control.value = "one\ntwo";
        control.dispatchEvent(new Event("input"));

        expect(host.value).to.equal("one\ntwo");
        expect(internals.formValue).to.equal("one\ntwo");
    });

    it("should not submit the form on Enter", () => {
        const { form, control } = setup();
        let submits = 0;
        form.addEventListener("submit", event => {
            submits++;
            event.preventDefault();
        });

        control.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

        expect(submits).to.equal(0);
    });
});
