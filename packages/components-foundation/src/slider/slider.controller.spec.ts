import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import type { SliderLabelElement } from "../slider-label/slider-label.js";
import { Orientation } from "../utilities/orientation.js";
import { type SliderElement, sliderPercent } from "./slider.js";
import { SliderController } from "./slider.controller.js";

const { expect } = chai;

class TestSlider extends TestFormControl implements SliderElement {
    public name: string | null = null;
    public defaultValue: string | null = null;
    public min = 0;
    public max = 100;
    public step = 1;
    public orientation: Orientation = Orientation.horizontal;
    public disabled = false;
    public readOnly = false;
    public valueTextFormatter: ((value: string) => string) | null = null;
    public controller!: SliderController;
    public get value(): string {
        return this.controller.value;
    }
    public set value(value: string) {
        this.controller.value = value;
    }
    public get valueAsNumber(): number {
        return Number(this.value);
    }
    public stepUp(count = 1): void {
        this.controller.stepBy(count);
    }
    public stepDown(count = 1): void {
        this.controller.stepBy(-count);
    }
}
customElements.define("test-slider", TestSlider);

class TestSliderLabel extends HTMLElement implements SliderLabelElement {
    public position = 0;
    public hideMark = false;
    public percent = 0;
    public orientation: Orientation = Orientation.horizontal;
}
customElements.define("test-slider-label", TestSliderLabel);

function setup(configure: (host: TestSlider) => void = () => {}) {
    const host = document.body.appendChild(new TestSlider());
    const track = host.appendChild(document.createElement("div"));
    configure(host);
    const internals = new TestInternals();
    let notified = 0;
    const controller = new SliderController(host, internals, { onValueChange: () => notified++ });
    host.controller = controller;
    controller.defaultValueChanged();
    controller.connect(track);
    const events: string[] = [];
    host.addEventListener("input", () => events.push("input"));
    host.addEventListener("change", () => events.push("change"));
    return { host, track, internals, controller, events, notified: () => notified };
}

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

describe("SliderController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should be a slider in the middle of its range by default, as a native range", () => {
        const { host, internals } = setup();

        expect(internals.role).to.equal("slider");
        expect(host.value).to.equal("50");
        expect([internals.ariaValueMin, internals.ariaValueNow, internals.ariaValueMax]).to.deep.equal(["0", "50", "100"]);
        expect(internals.formValue).to.equal("50");
        expect(host.tabIndex).to.equal(0);
    });

    it("should keep the value in the range and on a step", () => {
        const { host, controller } = setup(host => {
            host.min = 10;
            host.step = 5;
        });
        controller.stateChanged();

        host.value = "23";
        expect(host.value).to.equal("25");

        host.value = "500";
        expect(host.value).to.equal("100");

        host.value = "-3";
        expect(host.value).to.equal("10");
    });

    it("should round away the error of floating point", () => {
        const { host, controller } = setup(host => {
            host.max = 1;
            host.step = 0.1;
        });
        controller.stateChanged();

        host.value = "0.3";
        host.stepUp();

        expect(host.value).to.equal("0.4");
    });

    it("should take the value attribute as the default until the value changes, and go back to it on reset", () => {
        const { host, controller } = setup(host => {
            host.defaultValue = "20";
        });
        expect(host.value).to.equal("20");

        host.value = "70";
        host.defaultValue = "30";
        controller.defaultValueChanged();
        expect(host.value).to.equal("70");

        controller.formReset();
        expect(host.value).to.equal("30");
    });

    describe("keyboard", () => {
        it("should change by a step with the arrows, and emit input and change", () => {
            const { host, events } = setup();

            press(host, "ArrowRight");
            press(host, "ArrowUp");
            press(host, "ArrowLeft");

            expect(host.value).to.equal("51");
            expect(events).to.deep.equal(["input", "change", "input", "change", "input", "change"]);
        });

        it("should change by a tenth with Page Up and Page Down, and go to the ends with Home and End", () => {
            const { host } = setup();

            press(host, "PageUp");
            expect(host.value).to.equal("60");

            press(host, "End");
            expect(host.value).to.equal("100");

            press(host, "Home");
            expect(host.value).to.equal("0");
        });

        it("should not change when it is read only, nor emit", () => {
            const { host, internals, controller, events } = setup();
            host.readOnly = true;
            controller.stateChanged();

            press(host, "ArrowRight");

            expect(host.value).to.equal("50");
            expect(events).to.deep.equal([]);
            expect(internals.ariaReadOnly).to.equal("true");
        });
    });

    it("should say the value with its value text", () => {
        const { host, internals, controller } = setup();

        host.valueTextFormatter = value => `${value}%`;
        controller.stateChanged();

        expect(internals.ariaValueText).to.equal("50%");
    });

    it("should tell the binding when the value changes", () => {
        const { host, notified } = setup();
        const before = notified();

        host.value = "10";

        expect(notified()).to.equal(before + 1);
    });

    it("should give its labels where they are, and its orientation", () => {
        const { host, controller } = setup();
        const label = host.appendChild(new TestSliderLabel());
        label.position = 25;

        controller.setLabels([label]);
        host.orientation = Orientation.vertical;
        controller.stateChanged();

        expect(label.percent).to.equal(25);
        expect(label.orientation).to.equal("vertical");
    });
});

describe("sliderPercent", () => {
    it("should be where a value is in the range, and at the ends outside it", () => {
        expect(sliderPercent(5, 0, 10)).to.equal(50);
        expect(sliderPercent(20, 0, 10)).to.equal(100);
        expect(sliderPercent(5, 10, 10)).to.equal(0);
    });
});
