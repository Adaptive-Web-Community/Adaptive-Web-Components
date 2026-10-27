import { attr, nullableNumberConverter } from "@microsoft/fast-element";
import { CalendarController, type CalendarElement } from "@adaptive-web/components-foundation";
import { BaseFormControl } from "../../utilities/base-form-control.js";

/**
 * A calendar. Implements {@link @adaptive-web/components-foundation#CalendarElement}.
 *
 * @remarks
 * Defined with `delegatesFocus`, so focusing the element focuses its first button.
 *
 * @public
 */
export class Calendar extends BaseFormControl implements CalendarElement {
    // Before the properties, whose change handlers use it while the element is constructed.
    private readonly controller = new CalendarController(this, this.internals);

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.name}
     */
    @attr
    public name: string | null = null;
    protected nameChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.defaultValue}
     */
    @attr({ attribute: "value" })
    public defaultValue: string | null = null;
    protected defaultValueChanged(): void {
        this.controller.defaultValueChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.multiple}
     */
    @attr({ mode: "boolean" })
    public multiple: boolean = false;
    protected multipleChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.min}
     */
    @attr
    public min: string | null = null;
    protected minChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.max}
     */
    @attr
    public max: string | null = null;
    protected maxChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.disabledDates}
     */
    @attr({ attribute: "disabled-dates" })
    public disabledDates: string | null = null;
    protected disabledDatesChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.month}
     */
    @attr({ converter: nullableNumberConverter })
    public month: number | null = null;
    protected monthChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.year}
     */
    @attr({ converter: nullableNumberConverter })
    public year: number | null = null;
    protected yearChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.locale}
     */
    @attr
    public locale: string | null = null;
    protected localeChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.firstDay}
     */
    @attr({ attribute: "first-day", converter: nullableNumberConverter })
    public firstDay: number | null = null;
    protected firstDayChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.readOnly}
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean = false;
    protected readOnlyChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.value}
     */
    public get value(): string {
        return this.controller.value;
    }
    public set value(value: string) {
        this.controller.value = value;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CalendarElement.values}
     */
    public get values(): readonly string[] {
        return this.controller.values;
    }

    /** @internal */
    public titleElement?: HTMLElement;
    /** @internal */
    public previousButton?: HTMLButtonElement;
    /** @internal */
    public nextButton?: HTMLButtonElement;
    /** @internal */
    public days?: HTMLTableElement;

    public connectedCallback(): void {
        super.connectedCallback();
        const { titleElement: title, previousButton: previous, nextButton: next, days } = this;
        if (title && previous && next && days) {
            this.controller.connect({ title, previous, next, days });
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    public formDisabledCallback(disabled: boolean): void {
        this.controller.disabledChanged(disabled);
    }

    public formResetCallback(): void {
        this.controller.formReset();
    }
}
