import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import { createOptions, TestOption } from "../__test__/listbox-option.js";
import { TestPopover } from "../__test__/popover.js";
import type { SelectElement } from "./select.js";
import { SelectController } from "./select.controller.js";

const { expect } = chai;

class TestSelect extends TestFormControl implements SelectElement {
    public label: string | null = null;
    public hideLabel = false;
    public name: string | null = null;
    public disabled = false;
    public readOnly = false;
    public required = false;
    public controller!: SelectController;
    public get value(): string {
        return this.controller.list.value;
    }
    public set value(value: string) {
        this.controller.setValue(value);
    }
}
customElements.define("test-select", TestSelect);

function setup(texts: string[], configure: (options: TestOption[]) => void = () => {}) {
    const host = document.body.appendChild(new TestSelect());
    const root = host.attachShadow({ mode: "open" });
    const label = root.appendChild(document.createElement("span"));
    const control = root.appendChild(document.createElement("div"));
    control.tabIndex = 0;
    const listbox = root.appendChild(new TestPopover());
    listbox.appendChild(document.createElement("slot"));
    const options = createOptions(host, texts);
    configure(options);
    const internals = new TestInternals();
    const controller = new SelectController(host, internals);
    host.controller = controller;
    TestOption.onSelected = option => controller.optionSelectedChanged(option);
    controller.setOptions(options);
    controller.connect(control, listbox, label);
    const events: string[] = [];
    host.addEventListener("input", () => events.push("input"));
    host.addEventListener("change", () => events.push("change"));
    return { host, label, control, listbox, options, internals, controller, events };
}

function press(target: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
}

const selected = (options: TestOption[]) => options.map(option => (option.selected ? 1 : 0)).join("");

describe("SelectController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        TestOption.onSelected = null;
    });

    it("should select the first option that isn't disabled when none is, as a native select", () => {
        const { options, internals } = setup(["a", "b"], options => {
            options[0].disabled = true;
        });

        expect(selected(options)).to.equal("01");
        expect(internals.formValue).to.equal("b");
    });

    it("should select no option when the value set is no option's, as a native select", () => {
        const { host, options, internals } = setup(["a", "b"]);

        host.value = "c";

        expect(selected(options)).to.equal("00");
        expect(host.value).to.equal("");
        expect(internals.formValue).to.be.null;
    });

    it("should select the first option when the selected one is unselected, as a native select", () => {
        const { options } = setup(["a", "b"], options => {
            options[1].selected = true;
        });

        options[1].selected = false;

        expect(selected(options)).to.equal("10");
    });

    it("should give the control its state", () => {
        const { host, control, controller } = setup(["a"]);
        host.readOnly = true;
        host.required = true;

        controller.stateChanged();

        expect(control.ariaExpanded).to.equal("false");
        expect(control.ariaReadOnly).to.equal("true");
        expect(control.ariaRequired).to.equal("true");
    });

    describe("popup", () => {
        it("should open on a click, anchored to the control, with the selected option active", () => {
            const { control, listbox, options, internals } = setup(["a", "b"], options => {
                options[1].selected = true;
            });

            control.click();

            expect(listbox.open).to.be.true;
            expect(listbox.source).to.equal(control);
            expect(control.ariaExpanded).to.equal("true");
            expect(internals.states.has("open")).to.be.true;
            expect(options[1].active).to.be.true;
            expect(control.ariaActiveDescendantElement).to.equal(options[1]);
        });

        it("should close on a second click, and point at no option", () => {
            const { control, listbox, options } = setup(["a"]);

            control.click();
            control.click();

            expect(listbox.open).to.be.false;
            expect(control.ariaExpanded).to.equal("false");
            expect(options[0].active).to.be.false;
            expect(control.ariaActiveDescendantElement).to.be.null;
        });

        it("should select an option that is clicked, and close", () => {
            const { control, listbox, options, events } = setup(["a", "b"]);
            control.click();

            options[1].click();

            expect(selected(options)).to.equal("01");
            expect(listbox.open).to.be.false;
            expect(events).to.deep.equal(["input", "change"]);
        });

        it("should not open when it is disabled, and close when it becomes disabled", () => {
            const { control, listbox, controller } = setup(["a"]);
            control.click();

            controller.disabledChanged(true);
            control.click();

            expect(listbox.open).to.be.false;
            expect(control.tabIndex).to.equal(-1);
            expect(control.ariaDisabled).to.equal("true");
        });
    });

    describe("keyboard", () => {
        it("should open with Down, Up, Enter, and Space, without selecting", () => {
            for (const key of ["ArrowDown", "ArrowUp", "Enter", " "]) {
                const { control, listbox, options } = setup(["a", "b"]);

                const event = press(control, key);

                expect(listbox.open, key).to.be.true;
                expect(event.defaultPrevented, key).to.be.true;
                expect(selected(options), key).to.equal("10");
                document.body.innerHTML = "";
            }
        });

        it("should move the active option when open, and select it with Enter and close", () => {
            const { control, listbox, options, events } = setup(["a", "b", "c"]);
            press(control, "ArrowDown");

            press(control, "ArrowDown");
            press(control, "ArrowDown");
            expect(selected(options)).to.equal("100");

            press(control, "Enter");
            expect(selected(options)).to.equal("001");
            expect(listbox.open).to.be.false;
            expect(events).to.deep.equal(["input", "change"]);
        });

        it("should close with Escape without selecting", () => {
            const { control, listbox, options } = setup(["a", "b"]);
            press(control, "ArrowDown");
            press(control, "ArrowDown");

            press(control, "Escape");

            expect(listbox.open).to.be.false;
            expect(selected(options)).to.equal("10");
        });

        it("should select the active option with Tab and close, without taking the Tab", () => {
            const { control, listbox, options } = setup(["a", "b"]);
            press(control, "ArrowDown");
            press(control, "ArrowDown");

            const event = press(control, "Tab");

            expect(event.defaultPrevented).to.be.false;
            expect(listbox.open).to.be.false;
            expect(selected(options)).to.equal("01");
        });

        it("should open and move to the option that starts with a letter typed", () => {
            const { control, listbox, options } = setup(["apple", "banana", "cherry"]);

            press(control, "c");

            expect(listbox.open).to.be.true;
            expect(options[2].active).to.be.true;
            expect(selected(options)).to.equal("100");
        });

        it("should not select when it is read only", () => {
            const { host, control, options, events } = setup(["a", "b"]);
            host.readOnly = true;
            press(control, "ArrowDown");
            press(control, "ArrowDown");

            press(control, "Enter");

            expect(selected(options)).to.equal("10");
            expect(events).to.deep.equal([]);
        });
    });

    describe("form", () => {
        it("should be missing its value when required and the selected option has none, as a placeholder", () => {
            const { host, options, internals, controller } = setup(["Choose", "b"], options => {
                options[0].value = "";
            });

            host.required = true;
            controller.stateChanged();
            expect(internals.validity).to.deep.equal({ valueMissing: true });

            options[1].selected = true;
            expect(internals.validity).to.deep.equal({});
            expect(internals.formValue).to.equal("b");
        });

        it("should select the default option when its form is reset", () => {
            const { options, controller } = setup(["a", "b"], options => {
                options[1].defaultSelected = true;
                options[1].selected = true;
            });
            options[0].selected = true;

            controller.formReset();

            expect(selected(options)).to.equal("01");
        });

        it("should be named by its label", () => {
            const { label, control } = setup(["a"]);

            expect(control.ariaLabelledByElements).to.deep.equal([label]);
        });

        it("should be named by its label and its outside labels", () => {
            const { label, control, internals, controller } = setup(["a"]);
            const outside = document.body.appendChild(document.createElement("label"));
            internals.labels = [outside] as unknown as NodeList;

            controller.labelsChanged();

            expect(control.ariaLabelledByElements).to.deep.equal([label, outside]);
        });

        it("should focus the control on a click on its label, as a native label", () => {
            const { label, control } = setup(["a"]);

            label.click();

            expect(control.getRootNode()).to.have.property("activeElement", control);
        });
    });
});
