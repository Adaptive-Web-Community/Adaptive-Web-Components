import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import { createOptions, TestOption } from "../__test__/listbox-option.js";
import { listboxOptionAria } from "../listbox-option/listbox-option.js";
import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import type { ListboxElement } from "./listbox.js";
import { ListboxController } from "./listbox.controller.js";

const { expect } = chai;

class TestListbox extends TestFormControl implements ListboxElement {
    public label: string | null = null;
    public hideLabel = false;
    public name: string | null = null;
    public multiple = false;
    public disabled = false;
    public readOnly = false;
    public required = false;
    public controller!: ListboxController;
    public get value(): string {
        return this.controller.list.value;
    }
    public set value(value: string) {
        this.controller.list.setValue(value);
    }
    public get selectedOptions(): readonly ListboxOptionElement[] {
        return this.controller.list.selected;
    }
}
customElements.define("test-listbox", TestListbox);

function setupLabelled() {
    const host = document.body.appendChild(new TestListbox());
    const internals = new TestInternals();
    const controller = new ListboxController(host, internals);
    return { internals, controller };
}

function setup(texts: string[], configure: (host: TestListbox, options: TestOption[]) => void = () => {}) {
    const host = document.body.appendChild(new TestListbox());
    const options = createOptions(host, texts);
    configure(host, options);
    const internals = new TestInternals();
    const controller = new ListboxController(host, internals);
    host.controller = controller;
    TestOption.onSelected = option => controller.optionSelectedChanged(option);
    controller.connect();
    controller.setOptions(options);
    const events: string[] = [];
    host.addEventListener("input", () => events.push("input"));
    host.addEventListener("change", () => events.push("change"));
    return { host, options, internals, controller, events };
}

function press(target: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
}

const selected = (options: TestOption[]) => options.map(option => (option.selected ? 1 : 0)).join("");
const activeIndex = (options: TestOption[]) => options.findIndex(option => option.active);

describe("ListboxController", () => {
    it("should be named by its label: the elements in the slot, or the text of the attribute", () => {
        const { internals, controller } = setupLabelled();
        const label = document.createElement("span");

        controller.labelChanged("Fruit", [label]);
        expect(internals.ariaLabelledByElements).to.deep.equal([label]);

        controller.labelChanged("Fruit", []);
        expect(internals.ariaLabelledByElements).to.be.null;
        expect(internals.ariaLabel).to.equal("Fruit");
    });

    beforeEach(() => {
        document.body.innerHTML = "";
        TestOption.onSelected = null;
    });

    it("should give the element the listbox role, and make it focusable", () => {
        const { host, internals } = setup(["a"]);

        expect(internals.role).to.equal("listbox");
        expect(host.tabIndex).to.equal(0);
    });

    it("should keep the last of several selected options in single selection", () => {
        const { options } = setup(["a", "b", "c"], (host, options) => {
            options[0].selected = true;
            options[2].selected = true;
        });

        expect(selected(options)).to.equal("001");
    });

    it("should make the selected option active when it gets the focus, and point at it", () => {
        const { host, options, internals } = setup(["a", "b"], (host, options) => {
            options[1].selected = true;
        });

        host.focus();

        expect(activeIndex(options)).to.equal(1);
        expect(internals.ariaActiveDescendantElement).to.equal(options[1]);
    });

    describe("single selection", () => {
        it("should move with Up and Down without wrapping, and select the option it moves to", () => {
            const { host, options, events } = setup(["a", "b", "c"]);
            host.focus();

            press(host, "ArrowDown");
            expect(activeIndex(options)).to.equal(1);
            expect(selected(options)).to.equal("010");
            expect(events).to.deep.equal(["input", "change"]);

            press(host, "End");
            press(host, "ArrowDown");
            expect(activeIndex(options)).to.equal(2);

            press(host, "Home");
            press(host, "ArrowUp");
            expect(activeIndex(options)).to.equal(0);
            expect(selected(options)).to.equal("100");
        });

        it("should reach a disabled option without selecting it, and skip a hidden one", () => {
            const { host, options } = setup(["a", "b", "c", "d"], (host, options) => {
                options[1].disabled = true;
                options[2].hidden = true;
            });
            host.focus();

            press(host, "ArrowDown");
            expect(activeIndex(options)).to.equal(1);
            expect(selected(options)).to.equal("0000");

            press(host, "ArrowDown");
            expect(activeIndex(options)).to.equal(3);
        });

        it("should select an option that is clicked", () => {
            const { options, events } = setup(["a", "b"]);

            options[1].click();

            expect(selected(options)).to.equal("01");
            expect(activeIndex(options)).to.equal(1);
            expect(events).to.deep.equal(["input", "change"]);
        });

        it("should unselect the others when an option is selected by code, without events", () => {
            const { host, options, events } = setup(["a", "b"]);

            options[0].selected = true;
            host.value = "b";

            expect(selected(options)).to.equal("01");
            expect(host.value).to.equal("b");
            expect(events).to.deep.equal([]);
        });
    });

    describe("typing", () => {
        it("should move to the option that starts with what is typed, and cycle with the same letter", () => {
            const { host, options } = setup(["apple", "banana", "blueberry", "cherry"]);
            host.focus();

            press(host, "b");
            expect(activeIndex(options)).to.equal(1);

            press(host, "b");
            expect(activeIndex(options)).to.equal(2);
        });

        it("should match several letters typed together", () => {
            const { host, options } = setup(["banana", "blueberry", "bread"]);
            host.focus();

            press(host, "b");
            press(host, "r");

            expect(activeIndex(options)).to.equal(2);
        });
    });

    describe("multiple selection", () => {
        it("should move without selecting, and toggle with Space", () => {
            const { host, options, internals } = setup(["a", "b", "c"], host => {
                host.multiple = true;
            });
            host.focus();

            press(host, "ArrowDown");
            expect(selected(options)).to.equal("000");

            press(host, " ");
            press(host, "ArrowDown");
            press(host, " ");
            expect(selected(options)).to.equal("011");
            expect(internals.ariaMultiSelectable).to.equal("true");

            press(host, " ");
            expect(selected(options)).to.equal("010");
        });

        it("should select as it moves with Shift, and select all with Control A", () => {
            const { host, options } = setup(["a", "b", "c"], host => {
                host.multiple = true;
            });
            host.focus();

            press(host, "ArrowDown", { shiftKey: true });
            expect(selected(options)).to.equal("010");

            press(host, "a", { ctrlKey: true });
            expect(selected(options)).to.equal("111");

            press(host, "a", { ctrlKey: true });
            expect(selected(options)).to.equal("000");
        });

        it("should toggle an option that is clicked, and keep several selected", () => {
            const { options } = setup(["a", "b"], host => {
                host.multiple = true;
            });

            options[0].click();
            options[1].click();

            expect(selected(options)).to.equal("11");
        });
    });

    describe("read only", () => {
        it("should move without selecting, and say it is read only", () => {
            const { host, options, internals, controller, events } = setup(["a", "b"]);
            host.readOnly = true;
            controller.stateChanged();
            host.focus();

            press(host, "ArrowDown");
            options[0].click();

            expect(activeIndex(options)).to.equal(0);
            expect(selected(options)).to.equal("00");
            expect(events).to.deep.equal([]);
            expect(internals.ariaReadOnly).to.equal("true");
        });
    });

    describe("form", () => {
        it("should give the values of the selected options under its name", () => {
            const { host, options, internals, controller } = setup(["a", "b", "c"], host => {
                host.multiple = true;
                host.name = "letters";
            });
            controller.stateChanged();

            options[0].click();
            options[2].click();

            expect((internals.formValue as FormData).getAll("letters")).to.deep.equal(["a", "c"]);
        });

        it("should give no value without a name or a selection", () => {
            const { internals } = setup(["a"]);

            expect(internals.formValue).to.be.null;
        });

        it("should be missing its value when required without a selection", () => {
            const { host, options, internals, controller } = setup(["a"]);

            host.required = true;
            controller.stateChanged();
            expect(internals.validity).to.deep.equal({ valueMissing: true });
            expect(internals.ariaRequired).to.equal("true");

            options[0].click();
            expect(internals.validity).to.deep.equal({});
        });

        it("should select the default options when its form is reset", () => {
            const { options, controller } = setup(["a", "b"], (host, options) => {
                options[0].defaultSelected = true;
                options[0].selected = true;
            });
            options[1].click();

            controller.formReset();

            expect(selected(options)).to.equal("10");
        });
    });
});

describe("listboxOptionAria", () => {
    it("should be an option, selected or not, and disabled", () => {
        const option = new TestOption();
        option.disabled = true;

        expect(listboxOptionAria(option)).to.deep.equal({ role: "option", ariaSelected: "false", ariaDisabled: "true" });
    });
});
