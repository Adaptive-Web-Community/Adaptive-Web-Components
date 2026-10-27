import { attr, Observable, observable } from "@microsoft/fast-element";
import { Orientation, SliderController, type SliderElement, sliderPercent } from "@adaptive-web/components-foundation";
import { BaseFormControl } from "../../utilities/base-form-control.js";
import { numberConverter } from "../../utilities/converters.js";
import { onDefined } from "../../utilities/defined.js";
import { SliderLabel } from "../slider-label/slider-label.js";

/**
 * A slider. Implements {@link @adaptive-web/components-foundation#SliderElement}.
 *
 * @remarks
 * Has the `dragging` custom state while the user drags it.
 *
 * @public
 */
export class Slider extends BaseFormControl implements SliderElement {
    // Before the properties, whose change handlers use it while the element is constructed.
    private readonly controller = new SliderController(this, this.internals, {
        onValueChange: () => Observable.notify(this, "value"),
    });

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.name}
     */
    @attr
    public name: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.defaultValue}
     */
    @attr({ attribute: "value" })
    public defaultValue: string | null = null;
    protected defaultValueChanged(): void {
        this.controller.defaultValueChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.min}
     */
    @attr({ mode: "fromView", converter: numberConverter(0) })
    public min: number = 0;
    protected minChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.max}
     */
    @attr({ mode: "fromView", converter: numberConverter(100) })
    public max: number = 100;
    protected maxChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.step}
     */
    @attr({ mode: "fromView", converter: numberConverter(1) })
    public step: number = 1;
    protected stepChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.orientation}
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;
    protected orientationChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.readOnly}
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean = false;
    protected readOnlyChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.valueTextFormatter}
     */
    @observable
    public valueTextFormatter: ((value: string) => string) | null = null;
    protected valueTextFormatterChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.value}
     */
    public get value(): string {
        Observable.track(this, "value");
        return this.controller.value;
    }
    public set value(value: string) {
        this.controller.value = value;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.valueAsNumber}
     */
    public get valueAsNumber(): number {
        return Number(this.value);
    }

    /**
     * Where the value is in the range, from 0 to 100, for the styles.
     *
     * @internal
     */
    public get percent(): number {
        return sliderPercent(Number(this.value), this.min, this.max);
    }

    /**
     * The track.
     *
     * @internal
     */
    public track?: HTMLElement;

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateLabels();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.stepUp}
     */
    public stepUp(count: number = 1): void {
        this.controller.stepBy(count);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderElement.stepDown}
     */
    public stepDown(count: number = 1): void {
        this.controller.stepBy(-count);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.track) {
            this.controller.connect(this.track);
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

    private updateLabels(): void {
        this.controller.setLabels(this.slottedElements.filter((element): element is SliderLabel => element instanceof SliderLabel));
        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateLabels());
    }
}
