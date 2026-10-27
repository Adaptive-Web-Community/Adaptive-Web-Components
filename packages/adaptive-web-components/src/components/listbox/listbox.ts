import { attr, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { ListboxController, type ListboxElement } from "@adaptive-web/components-foundation";
import { BaseFormControl } from "../../utilities/base-form-control.js";
import { onDefined } from "../../utilities/defined.js";
import { ListboxOption } from "../listbox-option/listbox-option.js";

/**
 * A listbox of {@link ListboxOption}s. Implements {@link @adaptive-web/components-foundation#ListboxElement}.
 *
 * @public
 */
export class Listbox extends BaseFormControl implements ListboxElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly controller = new ListboxController(this, this.internals);
    private options: ListboxOption[] = [];
    private readonly selectedSubscriber: Subscriber = {
        handleChange: (option: ListboxOption) => this.controller.optionSelectedChanged(option),
    };

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxElement.name}
     */
    @attr
    public name: string | null = null;
    protected nameChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxElement.multiple}
     */
    @attr({ mode: "boolean" })
    public multiple: boolean = false;
    protected multipleChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxElement.readOnly}
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean = false;
    protected readOnlyChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxElement.required}
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;
    protected requiredChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxElement.value}
     */
    public get value(): string {
        return this.controller.list.value;
    }
    public set value(value: string) {
        this.controller.list.setValue(value);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxElement.selectedOptions}
     */
    public get selectedOptions(): readonly ListboxOption[] {
        return this.options.filter(option => option.selected);
    }

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateOptions();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
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

    private updateOptions(): void {
        for (const option of this.options) {
            Observable.getNotifier(option).unsubscribe(this.selectedSubscriber, "selected");
        }

        this.options = this.slottedElements.filter((element): element is ListboxOption => element instanceof ListboxOption);

        for (const option of this.options) {
            Observable.getNotifier(option).subscribe(this.selectedSubscriber, "selected");
        }

        this.controller.setOptions(this.options);

        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateOptions());
    }
}
