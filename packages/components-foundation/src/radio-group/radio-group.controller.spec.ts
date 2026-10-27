import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import type { RadioElement } from "../radio/radio.js";
import { RadioController } from "../radio/radio.controller.js";
import { Orientation } from "../utilities/orientation.js";
import type { RadioGroupElement } from "./radio-group.js";
import { RadioGroupController } from "./radio-group.controller.js";

const { expect } = chai;

// A binding observes `checked` and tells the group; this stands in for it.
let group: RadioGroupController | null = null;

class TestRadio extends TestFormControl implements RadioElement {
    private _checked = false;
    public defaultChecked = false;
    public disabled = false;
    public groupReadOnly = false;
    public name: string | null = null;
    public value = "on";
    public readonly controller = new RadioController(this, new TestInternals());

    public get checked(): boolean {
        return this._checked;
    }
    public set checked(checked: boolean) {
        if (checked !== this._checked) {
            this._checked = checked;
            group?.radioCheckedChanged(this);
        }
    }

    // JSDOM doesn't match `:disabled` on a custom element.
    public matches(selector: string): boolean {
        return selector === ":disabled" ? this.disabled : super.matches(selector);
    }
}
customElements.define("test-radio", TestRadio);

class TestRadioGroup extends TestFormControl implements RadioGroupElement {
    public name: string | null = null;
    public orientation: Orientation = Orientation.horizontal;
    public readOnly = false;
    public required = false;
    public get value(): string | null {
        return group!.value;
    }
    public set value(value: string | null) {
        group!.value = value;
    }
}
customElements.define("test-radio-group", TestRadioGroup);

function setup(values: string[]) {
    const host = document.body.appendChild(new TestRadioGroup());
    const internals = new TestInternals();
    const controller = new RadioGroupController(host, internals);
    group = controller;
    const radios = values.map(value => {
        const radio = host.appendChild(new TestRadio());
        radio.value = value;
        radio.controller.connect();
        return radio;
    });
    controller.connect();
    controller.setRadios(radios);
    return { host, internals, controller, radios };
}

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

const tabIndexes = (radios: HTMLElement[]) => radios.map(radio => radio.tabIndex);
const checkedValues = (radios: TestRadio[]) => radios.filter(radio => radio.checked).map(radio => radio.value);

describe("RadioGroupController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        group = null;
    });

    it("should give the element the radiogroup role, in its orientation", () => {
        const { internals } = setup(["a"]);

        expect(internals.role).to.equal("radiogroup");
        expect(internals.ariaOrientation).to.equal("horizontal");
    });

    it("should name the group by its label", () => {
        const { internals, controller } = setup(["a"]);
        const label = document.createElement("span");

        controller.labelsChanged([label]);
        expect(internals.ariaLabelledByElements).to.deep.equal([label]);

        controller.labelsChanged([]);
        expect(internals.ariaLabelledByElements).to.be.null;
    });

    describe("checked", () => {
        it("should keep the last of several checked radios", () => {
            const host = document.body.appendChild(new TestRadioGroup());
            const controller = new RadioGroupController(host, new TestInternals());
            const radios = ["a", "b", "c"].map(value => Object.assign(host.appendChild(new TestRadio()), { value }));
            radios[0].checked = true;
            radios[2].checked = true;

            controller.setRadios(radios);

            expect(checkedValues(radios)).to.deep.equal(["c"]);
        });

        it("should uncheck the others when a radio is checked", () => {
            const { radios } = setup(["a", "b", "c"]);

            radios[0].click();
            radios[2].click();

            expect(checkedValues(radios)).to.deep.equal(["c"]);
        });

        it("should give and take the value of the checked radio", () => {
            const { host, radios } = setup(["a", "b"]);

            host.value = "b";
            expect(checkedValues(radios)).to.deep.equal(["b"]);
            expect(host.value).to.equal("b");

            host.value = null;
            expect(checkedValues(radios)).to.deep.equal([]);
            expect(host.value).to.be.null;
        });
    });

    it("should give its name to the radios", () => {
        const { host, controller, radios } = setup(["a", "b"]);

        host.name = "size";
        controller.nameChanged();

        expect(radios.map(radio => radio.name)).to.deep.equal(["size", "size"]);
    });

    describe("required", () => {
        it("should be missing its value when no radio is checked, shown at the first radio that isn't disabled", () => {
            const { host, internals, controller, radios } = setup(["a", "b"]);
            radios[0].disabled = true;

            host.required = true;
            controller.requiredChanged();

            expect(internals.validity).to.deep.equal({ valueMissing: true });
            expect(internals.validationAnchor).to.equal(radios[1]);
            expect(internals.ariaRequired).to.equal("true");
        });

        it("should be valid when a radio is checked", () => {
            const { host, internals, controller, radios } = setup(["a", "b"]);
            host.required = true;
            controller.requiredChanged();

            radios[1].click();

            expect(internals.validity).to.deep.equal({});
        });

        it("should not be validated when it is read only", () => {
            const { host, internals, controller } = setup(["a"]);
            host.required = true;
            host.readOnly = true;

            controller.requiredChanged();

            expect(internals.validity).to.deep.equal({});
        });
    });

    describe("read only", () => {
        it("should make its radios read only, and say it is", () => {
            const { host, internals, controller, radios } = setup(["a", "b"]);

            host.readOnly = true;
            controller.readOnlyChanged();

            expect(radios.map(radio => radio.groupReadOnly)).to.deep.equal([true, true]);
            expect(internals.ariaReadOnly).to.equal("true");
        });

        it("should move the focus with the arrows, without checking", () => {
            const { host, controller, radios } = setup(["a", "b"]);
            host.readOnly = true;
            controller.readOnlyChanged();

            press(radios[0], "ArrowDown");
            radios[0].click();

            expect(document.activeElement).to.equal(radios[1]);
            expect(checkedValues(radios)).to.deep.equal([]);
        });
    });

    describe("focus", () => {
        it("should have the first radio in the tab order when none is checked", () => {
            const { radios } = setup(["a", "b", "c"]);

            expect(tabIndexes(radios)).to.deep.equal([0, -1, -1]);
        });

        it("should have the checked radio in the tab order", () => {
            const { radios } = setup(["a", "b", "c"]);

            radios[1].click();

            expect(tabIndexes(radios)).to.deep.equal([-1, 0, -1]);
        });

        it("should skip a disabled radio for the tab order", () => {
            const host = document.body.appendChild(new TestRadioGroup());
            const controller = new RadioGroupController(host, new TestInternals());
            const radios = ["a", "b"].map(value => Object.assign(host.appendChild(new TestRadio()), { value }));
            radios[0].disabled = true;

            controller.setRadios(radios);

            expect(tabIndexes(radios)).to.deep.equal([-1, 0]);
        });
    });

    describe("keyboard", () => {
        it("should move to the next radio with Down and Right, and check it", () => {
            const { radios } = setup(["a", "b", "c"]);
            let changes = 0;
            radios[1].addEventListener("change", () => changes++);

            press(radios[0], "ArrowDown");
            expect(document.activeElement).to.equal(radios[1]);
            expect(checkedValues(radios)).to.deep.equal(["b"]);
            expect(changes).to.equal(1);

            press(radios[1], "ArrowRight");
            expect(checkedValues(radios)).to.deep.equal(["c"]);
            expect(tabIndexes(radios)).to.deep.equal([-1, -1, 0]);
        });

        it("should move to the previous radio with Up and Left, and wrap", () => {
            const { radios } = setup(["a", "b", "c"]);

            press(radios[0], "ArrowUp");
            expect(checkedValues(radios)).to.deep.equal(["c"]);

            press(radios[2], "ArrowLeft");
            expect(checkedValues(radios)).to.deep.equal(["b"]);
        });

        it("should skip a disabled radio", () => {
            const { radios } = setup(["a", "b", "c"]);
            radios[1].disabled = true;

            press(radios[0], "ArrowDown");

            expect(checkedValues(radios)).to.deep.equal(["c"]);
        });

        it("should swap Left and Right right to left", () => {
            const { host, radios } = setup(["a", "b", "c"]);
            host.style.direction = "rtl";

            press(radios[0], "ArrowLeft");

            expect(checkedValues(radios)).to.deep.equal(["b"]);
        });

        it("should ignore a key in a radio's content, and other keys", () => {
            const { radios } = setup(["a", "b"]);
            const content = radios[0].appendChild(document.createElement("span"));

            expect(press(content, "ArrowDown").defaultPrevented).to.be.false;
            expect(press(radios[0], "Home").defaultPrevented).to.be.false;
            expect(checkedValues(radios)).to.deep.equal([]);
        });
    });
});
