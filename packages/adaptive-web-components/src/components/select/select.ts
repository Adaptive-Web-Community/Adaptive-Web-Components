import { attr, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { SelectController, type SelectElement } from "@adaptive-web/components-foundation";
import { BaseFormControl } from "../../utilities/base-form-control.js";
import { onDefined } from "../../utilities/defined.js";
import { ListboxOption } from "../listbox-option/listbox-option.js";

/**
 * A select of {@link ListboxOption}s. Implements {@link @adaptive-web/components-foundation#SelectElement}.
 *
 * @remarks
 * Defined with `delegatesFocus`, so focusing the element, or a label of it, focuses its combobox. Has the `open` custom state while its
 * popup is open.
 *
 * @public
 */
export class Select extends BaseFormControl implements SelectElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly controller = new SelectController(this, this.internals);
    private options: ListboxOption[] = [];
    private readonly selectedSubscriber: Subscriber = {
        handleChange: (option: ListboxOption) => {
            this.controller.optionSelectedChanged(option);
            this.updateSelectedText();
        },
    };

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SelectElement.name}
     */
    @attr
    public name: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SelectElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SelectElement.readOnly}
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean = false;
    protected readOnlyChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SelectElement.required}
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;
    protected requiredChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SelectElement.value}
     */
    public get value(): string {
        return this.controller.list.value;
    }
    public set value(value: string) {
        this.controller.setValue(value);
    }

    /**
     * The text of the selected option, which the control shows.
     *
     * @internal
     */
    @observable
    public selectedText: string = "";

    /**
     * The combobox.
     *
     * @internal
     */
    public control?: HTMLElement;

    /**
     * The popup of the options.
     *
     * @internal
     */
    public listbox?: HTMLElement;

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
        if (this.control && this.listbox) {
            this.controller.connect(this.control, this.listbox);
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

    private updateOptions(): void {
        for (const option of this.options) {
            Observable.getNotifier(option).unsubscribe(this.selectedSubscriber, "selected");
        }

        this.options = this.slottedElements.filter((element): element is ListboxOption => element instanceof ListboxOption);

        for (const option of this.options) {
            Observable.getNotifier(option).subscribe(this.selectedSubscriber, "selected");
        }

        this.controller.setOptions(this.options);
        this.updateSelectedText();

        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateOptions());
    }

    private updateSelectedText(): void {
        this.selectedText = this.controller.list.selected[0]?.text ?? "";
    }
}
