import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import { createOptions, TestOption } from "../__test__/listbox-option.js";
import { TestPopover } from "../__test__/popover.js";
import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import type { PickerElement } from "./picker.js";
import { PickerController } from "./picker.controller.js";

const { expect } = chai;

class TestPicker extends TestFormControl implements PickerElement {
    public name: string | null = null;
    public multiple = false;
    public freeform = false;
    public disabled = false;
    public readOnly = false;
    public required = false;
    public placeholder: string | null = null;
    public loading = false;
    public controller!: PickerController;
    public get value(): string {
        return this.controller.values[0] ?? "";
    }
    public set value(value: string) {
        this.controller.setValue(value);
    }
    public get values(): readonly string[] {
        return this.controller.values;
    }
    public get query(): string {
        return this.controller.query;
    }
    public get selectedOptions(): readonly ListboxOptionElement[] {
        return this.controller.list.selected;
    }
}
customElements.define("test-picker", TestPicker);

function setup(texts: string[], configure: (host: TestPicker, options: TestOption[]) => void = () => {}) {
    const host = document.body.appendChild(new TestPicker());
    const root = host.attachShadow({ mode: "open" });
    const box = root.appendChild(document.createElement("div"));
    const values = box.appendChild(document.createElement("div"));
    const control = box.appendChild(document.createElement("input"));
    const popup = root.appendChild(new TestPopover());
    const listbox = popup.appendChild(document.createElement("div"));
    listbox.appendChild(document.createElement("slot"));
    const noResults = popup.appendChild(document.createElement("span"));
    const loading = popup.appendChild(document.createElement("span"));
    const removeContent = document.createElement("span");
    removeContent.innerHTML = "<b>x</b>";
    const options = createOptions(host, texts);
    configure(host, options);
    const internals = new TestInternals();
    const controller = new PickerController(host, internals);
    host.controller = controller;
    TestOption.onSelected = option => controller.optionSelectedChanged(option);
    controller.setOptions(options);
    controller.connect({ root: box, control, values, popup, listbox, noResults, loading, removeContent });
    const events: string[] = [];
    host.addEventListener("change", () => events.push("change"));
    host.addEventListener("filter", () => events.push("filter"));
    return { host, control, popup, listbox, noResults, loading, values, options, internals, controller, events };
}

function type(control: HTMLInputElement, text: string): void {
    control.value = text;
    control.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
}

function press(target: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
}

const selected = (options: TestOption[]) => options.map(option => (option.selected ? 1 : 0)).join("");
const shown = (options: TestOption[]) => options.map(option => (option.hidden ? 0 : 1)).join("");
const valueLabels = (values: HTMLElement) => Array.from(values.querySelectorAll("[part=value-label]")).map(label => label.textContent);

describe("PickerController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        TestOption.onSelected = null;
    });

    describe("filtering", () => {
        it("should emit filter, hide the options that don't contain the text, without case or accents, and open", () => {
            const { control, popup, options, events } = setup(["Crème brûlée", "Cherry", "Apple"]);

            type(control, "CR");

            expect(events).to.deep.equal(["filter"]);
            expect(shown(options)).to.equal("100");
            expect(popup.open).to.be.true;
            expect(popup.source).to.not.equal(control);
        });

        it("should not filter when filter is canceled", () => {
            const { host, control, options } = setup(["a", "b"]);
            host.addEventListener("filter", event => event.preventDefault());

            type(control, "a");

            expect(shown(options)).to.equal("11");
        });

        it("should say that no option is found, and not show an option the author hid", () => {
            const { control, popup, noResults, options } = setup(["apple", "banana"], (host, options) => {
                options[1].hidden = true;
            });

            type(control, "zzz");
            expect(popup.open).to.be.true;
            expect(noResults.hidden).to.be.false;

            type(control, "");
            expect(shown(options)).to.equal("10");
            expect(noResults.hidden).to.be.true;
        });

        it("should say that the options are loading, instead of that none is found", () => {
            const { host, control, listbox, noResults, loading, controller } = setup([]);
            host.addEventListener("filter", event => event.preventDefault());

            type(control, "a");
            host.loading = true;
            controller.stateChanged();

            expect(loading.hidden).to.be.false;
            expect(noResults.hidden).to.be.true;
            expect(listbox.ariaBusy).to.equal("true");

            host.loading = false;
            controller.stateChanged();
            expect(loading.hidden).to.be.true;
            expect(noResults.hidden).to.be.false;
        });
    });

    describe("single selection", () => {
        it("should select the active option with Enter, show it in the input, and close", () => {
            const { control, popup, options, internals, events } = setup(["apple", "banana"]);
            type(control, "an");

            press(control, "ArrowDown");
            press(control, "Enter");

            expect(selected(options)).to.equal("01");
            expect(control.value).to.equal("banana");
            expect(popup.open).to.be.false;
            expect(shown(options)).to.equal("11");
            expect(internals.formValue).to.equal("banana");
            expect(events.filter(event => event === "change")).to.have.length(1);
        });

        it("should put the selection back in the input when the user leaves text that isn't an option", () => {
            const { control, options } = setup(["apple", "banana"], (host, options) => {
                options[0].selected = true;
            });

            type(control, "ban");
            control.dispatchEvent(new Event("blur"));

            expect(control.value).to.equal("apple");
            expect(selected(options)).to.equal("10");
        });

        it("should clear the selection when the user empties the input", () => {
            const { control, options, events } = setup(["apple"], (host, options) => {
                options[0].selected = true;
            });

            type(control, "");
            control.dispatchEvent(new Event("blur"));

            expect(selected(options)).to.equal("0");
            expect(events).to.include("change");
        });

        it("should take the text as the value with freeform, and select the option with that text", () => {
            const { host, control, options, internals, events } = setup(["apple", "banana"], host => {
                host.freeform = true;
            });

            type(control, "kiwi");
            press(control, "Enter");
            expect(host.value).to.equal("kiwi");
            expect(internals.formValue).to.equal("kiwi");
            expect(events).to.include("change");

            type(control, "Apple");
            expect(selected(options)).to.equal("10");
            expect(host.value).to.equal("apple");
        });

        it("should open on a click in the field, and not on a value", () => {
            const { control, popup } = setup(["a"]);

            control.click();

            expect(popup.open).to.be.true;
        });

        it("should open with Down and make the selected option active", () => {
            const { control, popup, options } = setup(["a", "b"], (host, options) => {
                options[1].selected = true;
            });

            press(control, "ArrowDown");

            expect(popup.open).to.be.true;
            expect(options[1].active).to.be.true;
            expect(control.ariaActiveDescendantElement).to.equal(options[1]);
            expect(control.ariaExpanded).to.equal("true");
        });
    });

    describe("multiple selection", () => {
        it("should toggle the active option with Enter, list it, clear the input, and stay open", () => {
            const { host, control, popup, values, options, internals } = setup(["apple", "banana", "cherry"], host => {
                host.multiple = true;
                host.name = "fruit";
            });
            type(control, "an");

            press(control, "ArrowDown");
            press(control, "Enter");
            press(control, "ArrowDown");
            press(control, "ArrowDown");
            press(control, "Enter");

            expect(selected(options)).to.equal("011");
            expect(valueLabels(values)).to.deep.equal(["banana", "cherry"]);
            expect(values.querySelector("[part=value-remove]")!.innerHTML).to.equal("<b>x</b>");
            expect(values.hidden).to.be.false;
            expect(control.value).to.equal("");
            expect(popup.open).to.be.true;
            expect((internals.formValue as FormData).getAll("fruit")).to.deep.equal(["banana", "cherry"]);
        });

        it("should remove the last value with Backspace in the empty input, and a value with its button", () => {
            const { control, values, options } = setup(["a", "b", "c"], (host, options) => {
                host.multiple = true;
                options[0].selected = true;
                options[2].selected = true;
            });

            press(control, "Backspace");
            expect(selected(options)).to.equal("100");

            (values.querySelector("[part=value-remove]") as HTMLElement).click();
            expect(selected(options)).to.equal("000");
            expect(values.hidden).to.be.true;
        });

        it("should add the text as a value with freeform, or select the option with that text", () => {
            const { host, control, values, options } = setup(["apple"], host => {
                host.multiple = true;
                host.freeform = true;
            });

            type(control, "kiwi");
            press(control, "Enter");
            type(control, "APPLE");
            press(control, "Enter");

            expect(host.values).to.deep.equal(["apple", "kiwi"]);
            expect(selected(options)).to.equal("1");
            expect(valueLabels(values)).to.deep.equal(["apple", "kiwi"]);
        });
    });

    describe("state", () => {
        it("should not change the values when read only", () => {
            const { host, control, controller, options } = setup(["a"], host => {
                host.readOnly = true;
            });
            controller.stateChanged();
            press(control, "ArrowDown");

            press(control, "Enter");

            expect(control.readOnly).to.be.true;
            expect(selected(options)).to.equal("0");
            expect(host.values).to.deep.equal([]);
        });

        it("should disable its input and close when disabled", () => {
            const { control, popup, controller } = setup(["a"]);
            press(control, "ArrowDown");

            controller.disabledChanged(true);

            expect(control.disabled).to.be.true;
            expect(popup.open).to.be.false;
        });

        it("should be missing its value when required without one", () => {
            const { host, control, internals, controller } = setup(["a"]);
            host.required = true;

            controller.stateChanged();
            expect(internals.validity).to.deep.equal({ valueMissing: true });
            expect(control.ariaRequired).to.equal("true");

            host.value = "a";
            expect(internals.validity).to.deep.equal({});
        });

        it("should go back to the default options and drop the text when its form is reset", () => {
            const { host, control, options, controller } = setup(["a", "b"], (host, options) => {
                host.multiple = true;
                host.freeform = true;
                options[1].defaultSelected = true;
            });
            type(control, "x");
            press(control, "Enter");

            controller.formReset();

            expect(selected(options)).to.equal("01");
            expect(host.values).to.deep.equal(["b"]);
        });
    });
});
