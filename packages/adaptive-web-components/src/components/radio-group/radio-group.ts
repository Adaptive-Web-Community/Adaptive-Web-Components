import { attr, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { Orientation, RadioGroupController, type RadioGroupElement } from "@adaptive-web/components-foundation";
import { BaseFormControl } from "../../utilities/base-form-control.js";
import { onDefined } from "../../utilities/defined.js";
import { Radio } from "../radio/radio.js";

/**
 * A radio group of {@link Radio}s. Implements {@link @adaptive-web/components-foundation#RadioGroupElement}.
 *
 * @public
 */
export class RadioGroup extends BaseFormControl implements RadioGroupElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly controller = new RadioGroupController(this, this.internals);
    private radios: Radio[] = [];
    private readonly checkedSubscriber: Subscriber = {
        handleChange: (radio: Radio) => this.controller.radioCheckedChanged(radio),
    };

    /**
     * {@inheritDoc @adaptive-web/components-foundation#RadioGroupElement.name}
     */
    @attr
    public name: string | null = null;
    protected nameChanged(): void {
        this.controller.nameChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#RadioGroupElement.orientation}
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;
    protected orientationChanged(): void {
        this.controller.orientationChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#RadioGroupElement.readOnly}
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean = false;
    protected readOnlyChanged(): void {
        this.controller.readOnlyChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#RadioGroupElement.required}
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;
    protected requiredChanged(): void {
        this.controller.requiredChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#RadioGroupElement.value}
     */
    public get value(): string | null {
        return this.controller.value;
    }
    public set value(value: string | null) {
        this.controller.value = value;
    }

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateRadios();
    }

    /**
     * The elements in the `label` slot.
     *
     * @internal
     */
    @observable
    public labelElements: Element[] = [];
    protected labelElementsChanged(): void {
        this.controller.labelsChanged(this.labelElements);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    private updateRadios(): void {
        for (const radio of this.radios) {
            Observable.getNotifier(radio).unsubscribe(this.checkedSubscriber, "checked");
        }

        this.radios = this.slottedElements.filter((element): element is Radio => element instanceof Radio);

        for (const radio of this.radios) {
            Observable.getNotifier(radio).subscribe(this.checkedSubscriber, "checked");
        }

        this.controller.setRadios(this.radios);

        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateRadios());
    }
}
