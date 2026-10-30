import { type CalendarElement, CalendarParts } from "./calendar.js";
import { addDays, addMonths, fromIso, isIsoDate, today, toIso } from "./dates.js";

/**
 * What a {@link CalendarController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type CalendarInternals = Pick<ElementInternals, "setFormValue">;

/**
 * The elements of a calendar's template that a {@link CalendarController} works with.
 *
 * @public
 */
export type CalendarTemplateElements = {
    /** The month and year shown. */
    title: HTMLElement;

    /** The button that shows the month before. */
    previous: HTMLButtonElement;

    /** The button that shows the month after. */
    next: HTMLButtonElement;

    /** The table of the days, which the controller renders. */
    days: HTMLTableElement;
};

// The first day of the week of a locale, from 0 (Sunday) to 6, as `Intl.Locale` has it (1 for Monday to 7 for Sunday).
function localeFirstDay(locale: string): number {
    const intl = new Intl.Locale(locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number } };
    const firstDay = (intl.getWeekInfo?.() ?? intl.weekInfo)?.firstDay ?? 7;
    return firstDay % 7;
}

/**
 * The behavior of a {@link CalendarElement}: the grid of the month shown, rendered in the `days` part, with the names of the locale; the
 * buttons for the months before and after; the keys of the date picker's grid, with one day in the tab order; selecting one date or
 * several; `input` and `change`; and the form value and reset.
 *
 * @remarks
 * The binding creates it with the element's `ElementInternals`, calls {@link CalendarController.connect} with the parts once the template
 * rendered and {@link CalendarController.disconnect} with the element's lifecycle, {@link CalendarController.defaultValueChanged} when the
 * `value` attribute changes, {@link CalendarController.stateChanged} when anything else of the contract changes,
 * {@link CalendarController.disabledChanged} from `formDisabledCallback`, and {@link CalendarController.formReset} from
 * `formResetCallback`. The binding's `value` and `values` are the controller's.
 *
 * @public
 */
export class CalendarController {
    private selected: string[] = [];
    // Whether the user or code changed the selection, after which the `value` attribute no longer sets it.
    private dirty = false;
    // The day the keys moved to, or `""`; and the day in the tab order, which the keys move from: that day when it is in the month shown,
    // or else the selected date, today, or the first of the month.
    private active = "";
    private focusable = "";
    private elements: CalendarTemplateElements | null = null;
    private disabled = false;

    constructor(private readonly host: CalendarElement, private readonly internals: CalendarInternals) {}

    /**
     * The selected dates, in order.
     */
    public get values(): readonly string[] {
        return this.selected;
    }

    /**
     * The first selected date, or `""`.
     */
    public get value(): string {
        return this.selected[0] ?? "";
    }
    public set value(value: string) {
        this.dirty = true;
        this.select(isIsoDate(value) ? [value] : []);
        if (this.selected[0]) {
            this.show(this.selected[0]);
        }
        this.render();
    }

    /**
     * Starts rendering in the parts and handling their events. For when the element is connected and has rendered them.
     */
    public connect(elements: CalendarTemplateElements): void {
        this.elements = elements;
        elements.previous.addEventListener("click", this.handlePrevious);
        elements.next.addEventListener("click", this.handleNext);
        elements.days.addEventListener("keydown", this.handleKeydown);
        elements.days.addEventListener("click", this.handleClick);
        this.defaultValueChanged();
        this.render();
    }

    /**
     * Stops handling the events. For when the element is disconnected.
     */
    public disconnect(): void {
        const { elements } = this;
        elements?.previous.removeEventListener("click", this.handlePrevious);
        elements?.next.removeEventListener("click", this.handleNext);
        elements?.days.removeEventListener("keydown", this.handleKeydown);
        elements?.days.removeEventListener("click", this.handleClick);
    }

    /**
     * The `value` attribute changed. It sets the selection until the user or code changes it.
     */
    public defaultValueChanged(): void {
        if (!this.dirty) {
            this.select(this.defaults());
            this.render();
        }
    }

    /**
     * The month, the range, the disabled dates, the locale, the first day, multiple, or read only changed.
     */
    public stateChanged(): void {
        if (!this.host.multiple && this.selected.length > 1) {
            this.select(this.selected.slice(0, 1));
        }
        this.render();
    }

    /**
     * The element was disabled or enabled, by its `disabled` attribute or a fieldset around it.
     */
    public disabledChanged(disabled: boolean): void {
        this.disabled = disabled;
        this.render();
    }

    /**
     * The form was reset: the selection goes back to the `value` attribute.
     */
    public formReset(): void {
        this.dirty = false;
        this.select(this.defaults());
        this.render();
    }

    private defaults(): string[] {
        const dates = (this.host.defaultValue ?? "").split(",").map(date => date.trim()).filter(isIsoDate);
        return this.host.multiple ? dates : dates.slice(0, 1);
    }

    private select(dates: string[]): void {
        this.selected = [...new Set(dates)].sort();
        const { host } = this;
        if (host.multiple && host.name !== null && this.selected.length > 0) {
            const data = new FormData();
            for (const date of this.selected) {
                data.append(host.name, date);
            }
            this.internals.setFormValue(data);
        } else {
            this.internals.setFormValue(this.selected.length > 0 ? this.selected[0] : null);
        }
    }

    private get locale(): string {
        const { host } = this;
        return host.locale ?? host.closest("[lang]")?.getAttribute("lang") ?? navigator.language;
    }

    // The first of the month shown: the `month` and `year`, or the selected date's, or today's.
    private shown(): string {
        const { host } = this;
        const base = fromIso(this.active || this.selected[0] || today());
        const year = host.year ?? base.getUTCFullYear();
        const month = host.month ?? base.getUTCMonth() + 1;
        return toIso(new Date(Date.UTC(year, month - 1, 1)));
    }

    // Shows the month of a date.
    private show(date: string): void {
        const shown = fromIso(date);
        this.host.year = shown.getUTCFullYear();
        this.host.month = shown.getUTCMonth() + 1;
    }

    private isDisabled(date: string): boolean {
        const { host } = this;
        const disabled = (host.disabledDates ?? "").split(",").map(item => item.trim());
        return (!!host.min && date < host.min) || (!!host.max && date > host.max) || disabled.includes(date);
    }

    private render(): void {
        const { elements, host } = this;
        if (!elements) {
            return;
        }
        const { locale } = this;
        const first = this.shown();
        const firstDate = fromIso(first);
        const month = firstDate.getUTCMonth();
        const firstDay = host.firstDay ?? localeFirstDay(locale);

        const inMonth = (date: string) => fromIso(date).getUTCMonth() === month && date.startsWith(first.slice(0, 4));
        this.focusable = [this.active, this.selected.find(inMonth), today()].find(date => !!date && inMonth(date)) ?? first;

        const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
        elements.title.textContent = title.format(firstDate);
        const previous = addMonths(first, -1);
        const next = addMonths(first, 1);
        elements.previous.setAttribute("aria-label", title.format(fromIso(previous)));
        elements.next.setAttribute("aria-label", title.format(fromIso(next)));
        elements.previous.disabled = this.disabled || (!!host.min && addDays(first, -1) < host.min);
        elements.next.disabled = this.disabled || (!!host.max && next > host.max);

        const document = elements.days.ownerDocument;
        const cell = (tag: string, part: string, text: string) => {
            const element = document.createElement(tag);
            element.setAttribute("part", part);
            element.className = part;
            element.textContent = text;
            return element;
        };

        // The week, from the first day of the locale.
        const start = addDays(first, -((firstDate.getUTCDay() - firstDay + 7) % 7));
        const short = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
        const long = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" });
        const head = document.createElement("thead");
        const names = head.appendChild(document.createElement("tr"));
        names.setAttribute("part", CalendarParts.weekDays);
        names.className = CalendarParts.weekDays;
        for (let index = 0; index < 7; index++) {
            const date = fromIso(addDays(start, index));
            const name = names.appendChild(cell("th", CalendarParts.weekDay, short.format(date)));
            name.setAttribute("scope", "col");
            name.setAttribute("abbr", long.format(date));
        }

        const number = new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: "UTC" });
        const body = document.createElement("tbody");
        const now = today();
        for (let week = start; fromIso(week).getUTCMonth() === month || week < first; week = addDays(week, 7)) {
            const row = body.appendChild(document.createElement("tr"));
            row.setAttribute("part", CalendarParts.week);
            row.className = CalendarParts.week;
            for (let index = 0; index < 7; index++) {
                const date = addDays(week, index);
                const day = row.appendChild(cell("td", CalendarParts.day, ""));
                day.dataset.date = date;
                day.tabIndex = date === this.focusable && !this.disabled ? 0 : -1;
                day.setAttribute("aria-selected", `${this.selected.includes(date)}`);
                if (this.isDisabled(date)) {
                    day.setAttribute("aria-disabled", "true");
                }
                if (date === now) {
                    day.setAttribute("aria-current", "date");
                }
                if (!inMonth(date)) {
                    day.dataset.outside = "";
                }
                day.appendChild(cell("span", CalendarParts.date, number.format(fromIso(date))));
            }
        }

        const setTrue = (element: Element, name: string, on: boolean) => (on ? element.setAttribute(name, "true") : element.removeAttribute(name));
        setTrue(elements.days, "aria-readonly", host.readOnly);
        setTrue(elements.days, "aria-disabled", this.disabled);
        elements.days.replaceChildren(head, body);
    }

    // Moves the active day, to another month when it leaves this one, and focuses it.
    private moveTo(date: string): void {
        const { elements } = this;
        // The focus in the shadow root is the root's: the document's is the host.
        const root = elements?.days.getRootNode() as Document | ShadowRoot | undefined;
        const focused = !!root?.activeElement && !!elements?.days.contains(root.activeElement);
        this.active = date;
        this.show(date);
        this.render();
        if (focused) {
            elements?.days.querySelector<HTMLElement>(`[data-date="${date}"]`)?.focus();
        }
    }

    private selectByUser(date: string): void {
        if (this.disabled || this.host.readOnly || this.isDisabled(date)) {
            return;
        }
        this.dirty = true;
        if (this.host.multiple) {
            this.select(this.selected.includes(date) ? this.selected.filter(item => item !== date) : [...this.selected, date]);
        } else if (this.selected[0] === date) {
            return;
        } else {
            this.select([date]);
        }
        this.moveTo(date);
        this.host.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        this.host.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private readonly handlePrevious = (): void => {
        this.active = "";
        this.show(addMonths(this.shown(), -1));
        this.render();
    };

    private readonly handleNext = (): void => {
        this.active = "";
        this.show(addMonths(this.shown(), 1));
        this.render();
    };

    // The keys of the date picker's grid: the arrows by a day and a week (Left and Right swapped right to left), Home and End to the ends
    // of the week, Page Up and Page Down by a month, and by a year with Shift, and Enter and Space to select.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        const cell = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-date]") : null;
        if (event.defaultPrevented || this.disabled || !cell?.dataset.date) {
            return;
        }
        // The keys move from the day that has the focus.
        const active = cell.dataset.date;
        const { host } = this;
        const rtl = getComputedStyle(host).direction === "rtl";
        const weekday = (fromIso(active).getUTCDay() - (host.firstDay ?? localeFirstDay(this.locale)) + 7) % 7;
        let next: string;
        switch (event.key) {
            case "ArrowRight":
                next = addDays(active, rtl ? -1 : 1);
                break;
            case "ArrowLeft":
                next = addDays(active, rtl ? 1 : -1);
                break;
            case "ArrowDown":
                next = addDays(active, 7);
                break;
            case "ArrowUp":
                next = addDays(active, -7);
                break;
            case "Home":
                next = addDays(active, -weekday);
                break;
            case "End":
                next = addDays(active, 6 - weekday);
                break;
            case "PageUp":
                next = addMonths(active, event.shiftKey ? -12 : -1);
                break;
            case "PageDown":
                next = addMonths(active, event.shiftKey ? 12 : 1);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                this.selectByUser(active);
                return;
            default:
                return;
        }
        event.preventDefault();
        this.moveTo(next);
    };

    private readonly handleClick = (event: MouseEvent): void => {
        const day = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-date]") : null;
        if (day?.dataset.date && !this.disabled) {
            this.selectByUser(day.dataset.date);
        }
    };
}
