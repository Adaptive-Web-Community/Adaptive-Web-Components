import { attr, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { PickerController, type PickerElement } from "@adaptive-web/components-foundation";
import { BaseFormControl } from "../../utilities/base-form-control.js";
import { onDefined } from "../../utilities/defined.js";
import { ListboxOption } from "../listbox-option/listbox-option.js";

/**
 * A picker of {@link ListboxOption}s. Implements {@link @adaptive-web/components-foundation#PickerElement}.
 *
 * @remarks
 * Defined with `delegatesFocus`, so focusing the element, or a label of it, focuses its input. Has the `open` custom state while its popup
 * is open.
 *
 * @public
 */
export class Picker extends BaseFormControl implements PickerElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly controller = new PickerController(this, this.internals);
    private options: ListboxOption[] = [];
    private readonly selectedSubscriber: Subscriber = {
        handleChange: (option: ListboxOption) => this.controller.optionSelectedChanged(option),
    };

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.name}
     */
    @attr
    public name: string | null = null;
    protected nameChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.multiple}
     */
    @attr({ mode: "boolean" })
    public multiple: boolean = false;
    protected multipleChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.freeform}
     */
    @attr({ mode: "boolean" })
    public freeform: boolean = false;
    protected freeformChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.readOnly}
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean = false;
    protected readOnlyChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.required}
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;
    protected requiredChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.loading}
     */
    @attr({ mode: "boolean" })
    public loading: boolean = false;
    protected loadingChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.placeholder}
     */
    @attr
    public placeholder: string | null = null;
    protected placeholderChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.value}
     */
    public get value(): string {
        return this.controller.values[0] ?? "";
    }
    public set value(value: string) {
        this.controller.setValue(value);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.values}
     */
    public get values(): readonly string[] {
        return this.controller.values;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.query}
     */
    public get query(): string {
        return this.controller.query;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#PickerElement.selectedOptions}
     */
    public get selectedOptions(): readonly ListboxOption[] {
        return this.options.filter(option => option.selected);
    }

    /**
     * The native input.
     *
     * @internal
     */
    public control?: HTMLInputElement;

    /**
     * The box of the field.
     *
     * @internal
     */
    public root?: HTMLElement;

    /**
     * The container of the values, which the controller renders.
     *
     * @internal
     */
    public valueList?: HTMLElement;

    /**
     * The popup, with the listbox and the status.
     *
     * @internal
     */
    public popup?: HTMLElement;

    /**
     * The listbox of the options.
     *
     * @internal
     */
    public listbox?: HTMLElement;

    /**
     * The status shown when no option is found.
     *
     * @internal
     */
    public noResults?: HTMLElement;

    /**
     * The status shown while the options are loading.
     *
     * @internal
     */
    public loadingStatus?: HTMLElement;

    /**
     * The content of the values' remove buttons, from the design system.
     *
     * @internal
     */
    public removeContent?: HTMLElement;

    /**
     * The elements in the `label` slot.
     *
     * @internal
     */
    @observable
    public labelElements: Element[] = [];

    /**
     * {@inheritDoc @adaptive-web/components-foundation#LabelledElement.label}
     */
    @attr
    public label: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#LabelledElement.hideLabel}
     */
    @attr({ attribute: "hide-label", mode: "boolean" })
    public hideLabel: boolean = false;

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
        const { root, control, valueList, popup, listbox, noResults, loadingStatus, removeContent } = this;
        if (root && control && valueList && popup && listbox && noResults && loadingStatus) {
            this.controller.connect({
                root,
                control,
                values: valueList,
                popup,
                listbox,
                noResults,
                loading: loadingStatus,
                removeContent: removeContent ?? null,
            });
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

        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateOptions());
    }
}
