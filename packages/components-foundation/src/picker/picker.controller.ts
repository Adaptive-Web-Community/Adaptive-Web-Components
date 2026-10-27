import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import { OptionListController } from "../listbox/option-list.controller.js";
import { AriaForwardingController } from "../utilities/aria-forwarding.controller.js";
import "../utilities/dom.js";
import { PickerParts } from "./picker.js";
import type { PickerElement } from "./picker.js";

/**
 * What a {@link PickerController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type PickerInternals = Pick<ElementInternals, "labels" | "states" | "setFormValue" | "setValidity">;

/**
 * The elements of a picker's template that a {@link PickerController} works with: those of the {@link PickerParts}, and the content of the
 * remove buttons it renders.
 *
 * @public
 */
export type PickerTemplateElements = {
    /** The box of the field, which the popup is anchored to. */
    root: HTMLElement;

    /** The native input. */
    control: HTMLInputElement;

    /** The container of the values, which the controller renders. */
    values: HTMLElement;

    /** The popover, with the listbox and the status. */
    popup: HTMLElement;

    /** The listbox, which has the options. */
    listbox: HTMLElement;

    /** What the status shows when no option is found. */
    noResults: HTMLElement;

    /** What the status shows while the options are loading. */
    loading: HTMLElement;

    /** An element whose content each value's remove button gets a copy of, such as an icon from a design system. */
    removeContent: Element | null;
};

// Text compared as the user means it: without case or accents.
function fold(text: string): string {
    return text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
}

/**
 * The behavior of a {@link PickerElement}: its options, with an {@link OptionListController}; the popup, which opens as the user types and
 * with the arrows; `filter`, and the options filtered by what is typed; the popup's status; the selection, in the input or as the values listed
 * before it, and the text the user gives
 * with `freeform`; the input's state and its name, from the outside labels and the author's ARIA; `input` and `change`; and the form value,
 * validity, and reset.
 *
 * @remarks
 * The binding creates it with the element's `ElementInternals`, calls {@link PickerController.connect} with the parts once the template
 * rendered and {@link PickerController.disconnect} with the element's lifecycle, and calls {@link PickerController.setOptions},
 * {@link PickerController.optionSelectedChanged}, {@link PickerController.stateChanged} when `multiple`, `freeform`, `readOnly`,
 * `required`, or `placeholder` change, {@link PickerController.disabledChanged} from `formDisabledCallback`, and
 * {@link PickerController.formReset} from `formResetCallback`. The controller renders the values, in the `values` part.
 *
 * @public
 */
export class PickerController {
    /**
     * The options, the active one, and the selection.
     */
    public readonly list: OptionListController;
    private elements: PickerTemplateElements | null = null;
    private readonly ariaForwarding: AriaForwardingController;
    private get control(): HTMLInputElement | null {
        return this.elements?.control ?? null;
    }
    // The text the user gave as values with `freeform`, in multiple selection.
    private freeValues: string[] = [];
    // In single selection, the text before the input shows the selection again; with `freeform`, the value when no option has it.
    private text = "";
    // Whether the user is typing in the input, which the selection doesn't overwrite then.
    private editing = false;
    // The options hidden by the filter, which are shown again: not those the author hid.
    private readonly filtered = new Set<ListboxOptionElement>();
    private disabled = false;

    constructor(private readonly host: PickerElement, private readonly internals: PickerInternals) {
        this.ariaForwarding = new AriaForwardingController(host);
        this.list = new OptionListController(host, {
            selectionFollowsFocus: false,
            onActiveChange: option => {
                if (this.control) {
                    this.control.ariaActiveDescendantElement = option;
                }
            },
            onUserChange: () => this.userChanged(),
        });
    }

    /**
     * Whether the popup is open.
     */
    public get open(): boolean {
        return this.elements?.popup.matches(":popover-open") ?? false;
    }

    /**
     * The values: the selected options' values, and the text the user gave with `freeform`.
     */
    public get values(): string[] {
        const values = this.list.selected.map(option => option.value);
        if (this.host.multiple) {
            return [...values, ...this.freeValues];
        }
        return values.length === 0 && this.host.freeform && this.text !== "" ? [this.text] : values;
    }

    /**
     * What the user typed to find options.
     */
    public get query(): string {
        return this.control?.value ?? "";
    }

    /**
     * Selects the option with the value, and unselects the others; with `freeform`, takes the value as text when no option has it.
     */
    public setValue(value: string): void {
        this.list.setValue(value);
        const found = this.list.selected.length > 0;
        this.freeValues = this.host.multiple && this.host.freeform && !found && value !== "" ? [value] : [];
        this.text = !this.host.multiple && this.host.freeform && !found ? value : "";
        this.editing = false;
        this.update();
    }

    /**
     * Starts keeping the parts in step, and handling their events. For when the element is connected and has rendered them.
     */
    public connect(elements: PickerTemplateElements): void {
        this.elements = elements;
        const { control, popup, listbox, root, values } = elements;
        // As an HTMLElement, so its event map types the listeners.
        const input: HTMLElement = control;
        input.addEventListener("input", this.handleInput);
        input.addEventListener("keydown", this.handleKeydown);
        input.addEventListener("focus", this.handleFocus);
        input.addEventListener("blur", this.handleBlur);
        root.addEventListener("click", this.handleRootClick);
        listbox.addEventListener("click", this.handleListboxClick);
        popup.addEventListener("mousedown", this.preventFocusChange);
        popup.addEventListener("toggle", this.handleToggle);
        values.addEventListener("click", this.handleValuesClick);
        values.addEventListener("mousedown", this.preventFocusChange);
        this.ariaForwarding.connect(control);
        control.ariaExpanded = "false";
        this.labelsChanged();
        this.stateChanged();
        this.disabledChanged(this.disabled);
    }

    /**
     * Stops handling the events. For when the element is disconnected.
     */
    public disconnect(): void {
        if (!this.elements) {
            return;
        }
        const { control, popup, listbox, root, values } = this.elements;
        const input: HTMLElement = control;
        input.removeEventListener("input", this.handleInput);
        input.removeEventListener("keydown", this.handleKeydown);
        input.removeEventListener("focus", this.handleFocus);
        input.removeEventListener("blur", this.handleBlur);
        root.removeEventListener("click", this.handleRootClick);
        listbox.removeEventListener("click", this.handleListboxClick);
        popup.removeEventListener("mousedown", this.preventFocusChange);
        popup.removeEventListener("toggle", this.handleToggle);
        values.removeEventListener("click", this.handleValuesClick);
        values.removeEventListener("mousedown", this.preventFocusChange);
        this.ariaForwarding.disconnect();
    }

    /**
     * The options changed, by the author, or after a `filter` the author canceled.
     */
    public setOptions(options: readonly ListboxOptionElement[]): void {
        for (const option of this.filtered) {
            if (!options.includes(option)) {
                this.filtered.delete(option);
            }
        }
        this.list.setOptions(options);
        this.update();
        this.updateStatus();
    }

    /**
     * An option was selected or unselected, by the user or by code.
     */
    public optionSelectedChanged(option: ListboxOptionElement): void {
        this.list.optionSelectedChanged(option);
        if (option.selected && !this.host.multiple) {
            this.text = "";
        }
        this.update();
    }

    /**
     * Multiple, freeform, loading, read only, required, or the placeholder changed.
     */
    public stateChanged(): void {
        const { control, host } = this;
        if (control) {
            control.readOnly = host.readOnly;
            control.placeholder = host.placeholder ?? "";
            control.ariaRequired = host.required ? "true" : null;
        }
        if (!host.multiple) {
            this.freeValues = [];
            this.list.setOptions(this.list.all);
        }
        this.update();
        this.updateStatus();
    }

    /**
     * The element was disabled or enabled, by its `disabled` attribute or a fieldset around it: the input is disabled, and the popup closes.
     */
    public disabledChanged(disabled: boolean): void {
        this.disabled = disabled;
        if (this.control) {
            this.control.disabled = disabled;
        }
        if (disabled) {
            this.close();
        }
    }

    /**
     * The outside labels of the element name the input. Called when it connects and gets the focus, since the labels can't be observed.
     */
    public labelsChanged(): void {
        const { control } = this;
        if (control) {
            const labels = Array.from(this.internals.labels).filter((node): node is Element => node instanceof Element);
            control.ariaLabelledByElements = labels.length > 0 ? labels : null;
        }
    }

    /**
     * The form was reset: the options are selected as by default, and the text the user gave is gone.
     */
    public formReset(): void {
        for (const option of this.list.all) {
            option.selected = option.defaultSelected;
        }
        this.list.setOptions(this.list.all);
        this.freeValues = [];
        this.text = "";
        this.editing = false;
        this.update();
    }

    /**
     * Opens the popup, with the options shown, or its status.
     */
    public show(): void {
        const { elements } = this;
        if (!this.disabled && elements && !this.open) {
            elements.popup.showPopover({ source: elements.root });
        }
    }

    /**
     * Closes the popup.
     */
    public close(): void {
        if (this.open) {
            this.elements?.popup.hidePopover();
        }
    }

    // The status: that the options are loading, while the author finds them, or that none is found, without an option to show.
    private updateStatus(): void {
        const { elements, host } = this;
        if (!elements) {
            return;
        }
        elements.loading.hidden = !host.loading;
        elements.noResults.hidden = host.loading || this.available().length > 0;
        elements.listbox.ariaBusy = host.loading ? "true" : null;
    }

    // The selection, shown in the input in single selection unless the user is typing, the values listed, the form value, and the validity.
    private update(): void {
        const { control, host, internals } = this;
        if (control && !host.multiple && !this.editing) {
            control.value = this.list.selected[0]?.text ?? this.text;
        }
        this.renderValues();

        const { values } = this;
        if (host.multiple) {
            if (host.name !== null && values.length > 0) {
                const data = new FormData();
                for (const value of values) {
                    data.append(host.name, value);
                }
                internals.setFormValue(data);
            } else {
                internals.setFormValue(null);
            }
        } else {
            internals.setFormValue(values[0] ?? "");
        }

        if (host.required && !host.readOnly && values.length === 0) {
            internals.setValidity({ valueMissing: true }, this.valueMissingMessage(), control ?? undefined);
        } else {
            internals.setValidity({});
        }
    }

    // The browser's message for a required field without a value, in the browser's language.
    private valueMissingMessage(): string {
        const input = this.host.ownerDocument.createElement("input");
        input.required = true;
        return input.validationMessage;
    }

    private renderValues(): void {
        const { elements, host } = this;
        if (!elements) {
            return;
        }

        const entries = host.multiple
            ? [...this.list.selected.map(option => ({ value: option.value, label: option.text })), ...this.freeValues.map(value => ({ value, label: value }))]
            : [];
        const { values, removeContent } = elements;
        const document = values.ownerDocument;
        values.replaceChildren(
            ...entries.map(({ value, label }) => {
                const item = document.createElement("span");
                item.setAttribute("part", PickerParts.value);
                item.setAttribute("role", "listitem");
                const text = item.appendChild(document.createElement("span"));
                text.setAttribute("part", PickerParts.valueLabel);
                text.textContent = label;
                // For the mouse; Backspace removes the last value from the keyboard, as Escape clears a search.
                const remove = item.appendChild(document.createElement("button"));
                remove.setAttribute("part", PickerParts.valueRemove);
                remove.type = "button";
                remove.tabIndex = -1;
                remove.ariaHidden = "true";
                remove.dataset.value = value;
                if (removeContent) {
                    remove.append(...Array.from(removeContent.childNodes, node => node.cloneNode(true)));
                }
                return item;
            })
        );
        values.hidden = entries.length === 0;
    }

    private userChanged(): void {
        this.update();
        this.host.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        this.host.dispatchEvent(new Event("change", { bubbles: true }));
    }

    private available(): ListboxOptionElement[] {
        return this.list.all.filter(option => !option.disabled && !option.hidden);
    }

    // The user typed: `filter`, which the author can cancel to find the options otherwise, then the options that don't contain the text are
    // hidden, and the popup shows those that do, or that none is found.
    private filter(): void {
        const proceed = this.host.dispatchEvent(new Event("filter", { bubbles: true, cancelable: true }));
        if (proceed) {
            const query = fold(this.query.trim());
            for (const option of this.list.all) {
                const hide = query !== "" && !fold(option.text).includes(query);
                if (hide && !option.hidden) {
                    option.hidden = true;
                    this.filtered.add(option);
                } else if (!hide && this.filtered.has(option)) {
                    option.hidden = false;
                    this.filtered.delete(option);
                }
            }
        }
        this.list.setActive(null);
        this.updateStatus();
        this.show();
    }

    private clearFilter(): void {
        for (const option of this.filtered) {
            option.hidden = false;
        }
        this.filtered.clear();
        this.updateStatus();
    }

    // The user chose an option, with Enter or a click: in single selection it is selected, shown, and the popup closes; in multiple
    // selection it is toggled, and the input is cleared for the next.
    private choose(option: ListboxOptionElement): void {
        if (option.disabled || this.host.readOnly) {
            return;
        }
        this.editing = false;
        const changed = this.host.multiple || !option.selected;
        if (this.host.multiple) {
            if (this.control) {
                this.control.value = "";
            }
            this.clearFilter();
            this.list.selectByUser(option);
            this.list.setActive(option);
        } else {
            this.clearFilter();
            this.list.selectByUser(option);
            this.close();
            if (!changed) {
                this.update();
            }
        }
    }

    // The user gave the text with `freeform` and Enter: in multiple selection it becomes a value, or selects the option with that text.
    private commitText(): void {
        const { control, host } = this;
        const text = this.query.trim();
        this.editing = false;
        if (!host.multiple) {
            this.close();
            this.host.dispatchEvent(new Event("change", { bubbles: true }));
            return;
        }
        if (!control || text === "") {
            return;
        }
        control.value = "";
        this.clearFilter();
        const option = this.list.all.find(option => !option.disabled && fold(option.text) === fold(text));
        if (option) {
            if (!option.selected) {
                this.list.selectByUser(option);
            }
        } else if (!this.freeValues.includes(text)) {
            this.freeValues = [...this.freeValues, text];
            this.userChanged();
        }
    }

    private removeValue(value: string): void {
        if (this.host.readOnly || this.disabled) {
            return;
        }
        if (this.freeValues.includes(value)) {
            this.freeValues = this.freeValues.filter(free => free !== value);
            this.userChanged();
            return;
        }
        const option = this.list.selected.find(option => option.value === value);
        if (option) {
            this.list.selectByUser(option);
        }
    }

    // With `freeform` in single selection, the text is the value: the option with that text is selected, and the others aren't.
    private takeText(): void {
        const text = this.query;
        this.text = text;
        const option = this.list.all.find(option => !option.disabled && fold(option.text) === fold(text));
        for (const other of this.list.all) {
            if (other !== option && other.selected) {
                other.selected = false;
            }
        }
        if (option && !option.selected) {
            option.selected = true;
        }
        this.update();
    }

    // In single selection without `freeform`, text that isn't an option goes back to the selection; an empty input clears it.
    private revertText(): void {
        this.editing = false;
        if (this.query === "" && this.list.selected.length > 0 && !this.host.readOnly) {
            for (const option of this.list.selected) {
                option.selected = false;
            }
            this.userChanged();
        } else {
            this.update();
        }
    }

    private readonly handleInput = (): void => {
        this.editing = true;
        if (!this.host.multiple && this.host.freeform) {
            this.takeText();
        }
        this.filter();
    };

    // The keys of the ARIA combobox with list autocomplete. The others are the input's: Home, End, and Space edit the text.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented) {
            return;
        }
        const { key } = event;
        const { host } = this;

        switch (key) {
            case "ArrowDown":
            case "ArrowUp":
                event.preventDefault();
                if (!this.open) {
                    this.clearFilter();
                    this.show();
                    if (!event.altKey) {
                        this.list.activateSelected();
                    }
                } else {
                    this.list.handleKeydown(event);
                }
                return;
            case "Enter":
                if (this.open && this.list.active) {
                    event.preventDefault();
                    this.choose(this.list.active);
                } else if (host.freeform && !host.readOnly) {
                    event.preventDefault();
                    this.commitText();
                }
                return;
            case "Escape":
                if (this.open) {
                    event.preventDefault();
                    this.close();
                } else if (host.multiple) {
                    this.clearQuery();
                } else if (!host.freeform) {
                    this.revertText();
                }
                return;
            case "Backspace":
                if (host.multiple && this.query === "") {
                    const last = this.values[this.values.length - 1];
                    if (last !== undefined) {
                        event.preventDefault();
                        this.removeValue(last);
                    }
                }
                return;
            case "Tab":
                this.close();
                return;
        }
    };

    private clearQuery(): void {
        if (this.control) {
            this.control.value = "";
        }
        this.clearFilter();
    }

    // A click in the field, not on a value, opens the popup.
    private readonly handleRootClick = (event: MouseEvent): void => {
        if (!this.open && !this.elements?.values.contains(event.target as Node)) {
            this.clearFilter();
            this.show();
        }
    };

    private readonly handleFocus = (): void => {
        this.labelsChanged();
    };

    // Leaving the input commits the text with `freeform` in single selection, and otherwise puts the selection back in it.
    private readonly handleBlur = (): void => {
        this.close();
        const { host } = this;
        if (host.multiple) {
            this.clearQuery();
        } else if (this.editing) {
            if (host.freeform) {
                this.commitText();
            } else {
                this.revertText();
            }
        }
    };

    private readonly handleListboxClick = (event: MouseEvent): void => {
        const option = this.list.all.find(option => option === event.target || option.contains(event.target as Node));
        if (option) {
            this.choose(option);
        }
    };

    private readonly handleValuesClick = (event: MouseEvent): void => {
        const button = event.target instanceof HTMLElement ? event.target.closest("button") : null;
        if (button?.dataset.value !== undefined) {
            this.removeValue(button.dataset.value);
        }
    };

    // A click in the popup or on a value keeps the focus in the input.
    private readonly preventFocusChange = (event: MouseEvent): void => {
        event.preventDefault();
    };

    // The popup opened or closed, by the picker or by the browser (Escape, a click outside).
    private readonly handleToggle = (): void => {
        const { open } = this;
        if (this.control) {
            this.control.ariaExpanded = open ? "true" : "false";
        }
        if (open) {
            this.internals.states.add("open");
            this.updateStatus();
        } else {
            this.internals.states.delete("open");
            this.list.setActive(null);
        }
    };
}
