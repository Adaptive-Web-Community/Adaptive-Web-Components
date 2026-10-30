import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { collapsedText, listboxOptionAria, type ListboxOptionElement } from "@adaptive-web/components-foundation";

/**
 * An option of a {@link Listbox}, a {@link Select}, or a {@link Picker}. Implements
 * {@link @adaptive-web/components-foundation#ListboxOptionElement}.
 *
 * @remarks
 * Has the `selected` and `active` custom states.
 *
 * @public
 */
export class ListboxOption extends FASTElement implements ListboxOptionElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    // Whether the user or code selected or unselected it, after which the `selected` attribute no longer sets it, as for a native option.
    private dirty = false;
    private applyingDefault = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxOptionElement.defaultSelected}
     */
    @attr({ attribute: "selected", mode: "boolean" })
    public defaultSelected: boolean = false;
    // Called with the default while the element is constructed, which gives `selected` its first value.
    protected defaultSelectedChanged(): void {
        if (!this.dirty) {
            this.applyingDefault = true;
            this.selected = this.defaultSelected;
            this.applyingDefault = false;
        }
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxOptionElement.selected}
     */
    @observable
    public selected!: boolean;
    protected selectedChanged(): void {
        this.dirty ||= !this.applyingDefault;
        this.toggleState("selected", this.selected);
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxOptionElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;
    protected disabledChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxOptionElement.active}
     */
    @observable
    public active: boolean = false;
    protected activeChanged(): void {
        this.toggleState("active", this.active);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxOptionElement.value}
     */
    public get value(): string {
        return this.getAttribute("value") ?? this.text;
    }
    public set value(value: string) {
        this.setAttribute("value", value);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListboxOptionElement.text}
     */
    public get text(): string {
        return collapsedText(this);
    }

    private toggleState(state: string, on: boolean): void {
        if (on) {
            this.internals.states.add(state);
        } else {
            this.internals.states.delete(state);
        }
    }

    private updateAria(): void {
        Object.assign(this.internals, listboxOptionAria(this));
    }
}
