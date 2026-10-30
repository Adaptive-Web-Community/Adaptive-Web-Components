import chai from "chai";
import { TestFormControl } from "../__test__/form-control.js";
import { TestInternals } from "../__test__/internals.js";
import type { CalendarElement } from "./calendar.js";
import { CalendarController } from "./calendar.controller.js";
import { addDays, addMonths, isIsoDate } from "./dates.js";

const { expect } = chai;

class TestCalendar extends TestFormControl implements CalendarElement {
    public label: string | null = null;
    public hideLabel = false;
    public name: string | null = null;
    public defaultValue: string | null = null;
    public multiple = false;
    public min: string | null = null;
    public max: string | null = null;
    public disabledDates: string | null = null;
    public month: number | null = null;
    public year: number | null = null;
    public locale: string | null = "en-US";
    public firstDay: number | null = null;
    public disabled = false;
    public readOnly = false;
    public controller!: CalendarController;
    public get value(): string {
        return this.controller.value;
    }
    public set value(value: string) {
        this.controller.value = value;
    }
    public get values(): readonly string[] {
        return this.controller.values;
    }
}
customElements.define("test-calendar", TestCalendar);

function setup(configure: (host: TestCalendar) => void = () => {}) {
    const host = document.body.appendChild(new TestCalendar());
    host.month = 10;
    host.year = 2026;
    configure(host);
    const root = host.attachShadow({ mode: "open" });
    const title = root.appendChild(document.createElement("span"));
    const previous = root.appendChild(document.createElement("button"));
    const next = root.appendChild(document.createElement("button"));
    const days = root.appendChild(document.createElement("table"));
    const internals = new TestInternals();
    const controller = new CalendarController(host, internals);
    host.controller = controller;
    controller.connect({ title, previous, next, days });
    const events: string[] = [];
    host.addEventListener("change", () => events.push("change"));
    return { host, root, title, previous, next, days, internals, controller, events };
}

const day = (days: HTMLTableElement, date: string) => days.querySelector<HTMLElement>(`[data-date="${date}"]`)!;
const focusable = (days: HTMLTableElement) => days.querySelector<HTMLElement>("[tabindex='0']")?.dataset.date;

function press(target: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
}

describe("CalendarController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should render the month in the locale, from its first day of the week", () => {
        const { title, previous, next, days } = setup();

        expect(title.textContent).to.equal("October 2026");
        expect(previous.getAttribute("aria-label")).to.equal("September 2026");
        expect(next.getAttribute("aria-label")).to.equal("November 2026");
        const names = Array.from(days.querySelectorAll("th"), th => th.textContent);
        expect(names[0]).to.equal("Sun");
        expect(days.querySelector("th")!.getAttribute("abbr")).to.equal("Sunday");
        expect(days.querySelectorAll("tbody tr").length).to.equal(5);
        expect(day(days, "2026-09-27").hasAttribute("data-outside")).to.be.true;
        expect(day(days, "2026-10-01").textContent).to.equal("1");
    });

    it("should start the week on the first day given", () => {
        const { days } = setup(host => {
            host.firstDay = 1;
        });

        expect(days.querySelector("th")!.textContent).to.equal("Mon");
    });

    it("should take the value attribute as the selection, and have that day in the tab order", () => {
        const { host, days, internals } = setup(host => {
            host.defaultValue = "2026-10-15";
        });

        expect(host.value).to.equal("2026-10-15");
        expect(day(days, "2026-10-15").getAttribute("aria-selected")).to.equal("true");
        expect(focusable(days)).to.equal("2026-10-15");
        expect(internals.formValue).to.equal("2026-10-15");
    });

    describe("keyboard", () => {
        it("should move by a day and a week, and to another month, which it shows", () => {
            const { host, root, days } = setup(host => {
                host.defaultValue = "2026-10-31";
            });
            day(days, "2026-10-31").focus();

            press(day(days, "2026-10-31"), "ArrowRight");

            expect([host.month, host.year]).to.deep.equal([11, 2026]);
            expect(root.activeElement).to.equal(day(days, "2026-11-01"));

            press(day(days, "2026-11-01"), "ArrowUp");
            expect(root.activeElement).to.equal(day(days, "2026-10-25"));
        });

        it("should move to the ends of the week with Home and End, and by a month and a year with Page Up and Page Down", () => {
            const { host, days } = setup(host => {
                host.defaultValue = "2026-10-15";
            });
            day(days, "2026-10-15").focus();

            press(day(days, "2026-10-15"), "Home");
            expect(focusable(days)).to.equal("2026-10-11");

            press(day(days, "2026-10-11"), "End");
            expect(focusable(days)).to.equal("2026-10-17");

            press(day(days, "2026-10-17"), "PageDown");
            expect(focusable(days)).to.equal("2026-11-17");

            press(day(days, "2026-11-17"), "PageUp", { shiftKey: true });
            expect(focusable(days)).to.equal("2025-11-17");
            expect([host.month, host.year]).to.deep.equal([11, 2025]);
        });

        it("should select with Enter, and emit change", () => {
            const { host, days, events } = setup();
            day(days, "2026-10-01").focus();

            press(day(days, "2026-10-01"), "ArrowDown");
            press(day(days, "2026-10-08"), "Enter");

            expect(host.value).to.equal("2026-10-08");
            expect(events).to.deep.equal(["change"]);
        });
    });

    it("should select a day that is clicked, and not one that is disabled or out of the range", () => {
        const { host, days } = setup(host => {
            host.min = "2026-10-05";
            host.disabledDates = "2026-10-10, 2026-10-11";
        });

        (day(days, "2026-10-02").firstElementChild as HTMLElement).click();
        day(days, "2026-10-10").click();
        expect(host.value).to.equal("");
        expect(day(days, "2026-10-10").getAttribute("aria-disabled")).to.equal("true");

        day(days, "2026-10-12").click();
        expect(host.value).to.equal("2026-10-12");
    });

    it("should select several dates with multiple, toggling them, and give them to the form", () => {
        const { host, days, internals } = setup(host => {
            host.multiple = true;
            host.name = "dates";
        });

        day(days, "2026-10-12").click();
        day(days, "2026-10-05").click();
        day(days, "2026-10-20").click();
        day(days, "2026-10-12").click();

        expect(host.values).to.deep.equal(["2026-10-05", "2026-10-20"]);
        expect((internals.formValue as FormData).getAll("dates")).to.deep.equal(["2026-10-05", "2026-10-20"]);
    });

    it("should not select when read only, and say it is", () => {
        const { host, days } = setup(host => {
            host.readOnly = true;
        });

        day(days, "2026-10-12").click();

        expect(host.value).to.equal("");
        expect(days.getAttribute("aria-readonly")).to.equal("true");
    });

    it("should show the months before and after with the buttons, and disable a button out of the range", () => {
        const { host, title, previous, next, controller } = setup(host => {
            host.max = "2026-11-20";
        });

        next.click();
        expect(title.textContent).to.equal("November 2026");
        expect(next.disabled).to.be.true;

        previous.click();
        expect([host.month, host.year]).to.deep.equal([10, 2026]);

        controller.disabledChanged(true);
        expect(previous.disabled).to.be.true;
    });

    it("should show the month of a value set by code, and go back to the default on reset", () => {
        const { host, title, controller } = setup(host => {
            host.defaultValue = "2026-10-02";
        });

        host.value = "2027-03-04";
        expect(title.textContent).to.equal("March 2027");

        controller.formReset();
        expect(host.value).to.equal("2026-10-02");
    });
});

describe("dates", () => {
    it("should add days and months as plain days", () => {
        expect(addDays("2026-03-08", 1)).to.equal("2026-03-09");
        expect(addDays("2026-12-31", 1)).to.equal("2027-01-01");
        expect(addMonths("2026-01-31", 1)).to.equal("2026-02-28");
        expect(addMonths("2024-03-31", -1)).to.equal("2024-02-29");
    });

    it("should know an ISO date that exists", () => {
        expect(isIsoDate("2026-02-28")).to.be.true;
        expect(isIsoDate("2026-02-30")).to.be.false;
        expect(isIsoDate("10-27-2026")).to.be.false;
    });
});
