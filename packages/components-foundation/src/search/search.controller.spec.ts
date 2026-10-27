import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import type { SearchElement } from "./search.js";
import { SearchController } from "./search.controller.js";

const { expect } = chai;

class TestSearch extends TestFormControl implements SearchElement {
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
    public pattern: string | null = null;
    public clear(): void {}
}
customElements.define("test-search", TestSearch);

function setup(configure: (host: TestSearch) => void = () => {}) {
    const host = document.body.appendChild(new TestSearch());
    configure(host);
    const control = host.attachShadow({ mode: "open" }).appendChild(document.createElement("input"));
    const internals = new TestInternals();
    const controller = new SearchController(host, internals);
    controller.connect(control);
    return { host, control, internals, controller };
}

describe("SearchController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should make the control a search input", () => {
        const { control } = setup();

        expect(control.type).to.equal("search");
    });

    it("should clear the value as the user does", () => {
        const { host, control, internals, controller } = setup(host => (host.value = "cats"));
        const fired: string[] = [];
        host.addEventListener("input", () => fired.push("input"));
        host.addEventListener("change", () => fired.push("change"));

        controller.clear();

        expect(host.value).to.equal("");
        expect(control.value).to.equal("");
        expect(internals.formValue).to.equal("");
        expect(fired).to.deep.equal(["input", "change"]);
    });

    it("should not clear when it is read only", () => {
        const { host, controller } = setup(host => Object.assign(host, { value: "cats", readOnly: true }));

        controller.clear();

        expect(host.value).to.equal("cats");
    });
});
