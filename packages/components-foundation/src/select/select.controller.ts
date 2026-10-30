import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import { OptionListController, type OptionListOwner } from "../listbox/option-list.controller.js";
import { AriaForwardingController } from "../utilities/aria-forwarding.controller.js";
import "../utilities/dom.js";
import type { SelectElement } from "./select.js";

/**
 * What a {@link SelectController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type SelectInternals = Pick<ElementInternals, "labels" | "states" | "setFormValue" | "setValidity">;

/**
 * The behavior of a {@link SelectElement}: its options, with an {@link OptionListController}, one always selected; the popup, opened and
 * closed by a click and by the keys of the ARIA select-only combobox; the combobox's state (`aria-expanded`, the active option, disabled,
 * read only, required) and its name, from its label, the outside labels, and the author's ARIA; `input` and `change`; and the form value, validity, and
 * reset.
 *
 * @remarks
 * The binding creates it with the element's `ElementInternals`, calls {@link SelectController.connect} with the control, the listbox, and
 * the label once the template rendered and {@link SelectController.disconnect} with the element's lifecycle, and calls {@link SelectController.setOptions},
 * {@link SelectController.optionSelectedChanged}, {@link SelectController.stateChanged} when `readOnly` or `required` change,
 * {@link SelectController.disabledChanged} from `formDisabledCallback`, and {@link SelectController.formReset} from `formResetCallback`.
 *
 * @public
 */
export class SelectController {
    /**
     * The options, the active one, and the selection.
     */
    public readonly list: OptionListController;
    private control: HTMLElement | null = null;
    private listbox: HTMLElement | null = null;
    private label: HTMLElement | null = null;
    private readonly ariaForwarding: AriaForwardingController;
    private disabled = false;
    // Whether `value` is being set, which selects no option when none has the value, as in a native select.
    private settingValue = false;

    constructor(private readonly host: SelectElement, private readonly internals: SelectInternals) {
        this.ariaForwarding = new AriaForwardingController(host);
        // A select has one option selected, and is read only when the element is.
        const owner: OptionListOwner = {
            multiple: false,
            get readOnly() {
                return host.readOnly;
            },
        };
        this.list = new OptionListController(owner, {
            selectionFollowsFocus: false,
            onActiveChange: option => {
                if (this.control) {
                    this.control.ariaActiveDescendantElement = option;
                }
            },
            onUserChange: () => {
                this.update();
                host.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
                host.dispatchEvent(new Event("change", { bubbles: true }));
            },
        });
    }

    /**
     * Whether the popup is open.
     */
    public get open(): boolean {
        return this.listbox?.matches(":popover-open") ?? false;
    }

    /**
     * Selects the option with the value, and unselects the others: none, when no option has it, as a native select.
     */
    public setValue(value: string): void {
        this.settingValue = true;
        this.list.setValue(value);
        this.settingValue = false;
        this.update();
    }

    /**
     * Starts keeping the control in step, and handling its events, the popup's, and the label's: a click on the label focuses the control, as
     * a native label's does. For when the element is connected and has rendered them.
     */
    public connect(control: HTMLElement, listbox: HTMLElement, label: HTMLElement): void {
        this.control = control;
        this.listbox = listbox;
        this.label = label;
        label.addEventListener("click", this.handleLabelClick);
        control.addEventListener("keydown", this.handleKeydown);
        control.addEventListener("click", this.handleControlClick);
        control.addEventListener("focus", this.handleFocus);
        listbox.addEventListener("click", this.handleListboxClick);
        listbox.addEventListener("mousedown", this.handleListboxMousedown);
        listbox.addEventListener("toggle", this.handleToggle);
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
        const { control, listbox } = this;
        this.label?.removeEventListener("click", this.handleLabelClick);
        control?.removeEventListener("keydown", this.handleKeydown);
        control?.removeEventListener("click", this.handleControlClick);
        control?.removeEventListener("focus", this.handleFocus);
        listbox?.removeEventListener("click", this.handleListboxClick);
        listbox?.removeEventListener("mousedown", this.handleListboxMousedown);
        listbox?.removeEventListener("toggle", this.handleToggle);
        this.ariaForwarding.disconnect();
    }

    /**
     * The options changed. When none is selected, the first that isn't disabled is, as in a native select.
     */
    public setOptions(options: readonly ListboxOptionElement[]): void {
        this.list.setOptions(options);
        this.selectDefault();
        this.update();
    }

    /**
     * An option was selected or unselected, by the user or by code. When none is selected then, the first that isn't disabled is, as when a
     * native option is unselected; not while `value` is set.
     */
    public optionSelectedChanged(option: ListboxOptionElement): void {
        this.list.optionSelectedChanged(option);
        if (!this.settingValue) {
            this.selectDefault();
        }
        this.update();
    }

    /**
     * Read only or required changed.
     */
    public stateChanged(): void {
        const { control, host } = this;
        if (control) {
            control.ariaReadOnly = host.readOnly ? "true" : null;
            control.ariaRequired = host.required ? "true" : null;
        }
        this.update();
    }

    /**
     * The element was disabled or enabled, by its `disabled` attribute or a fieldset around it: the control leaves the tab order, and the
     * popup closes.
     */
    public disabledChanged(disabled: boolean): void {
        this.disabled = disabled;
        const { control } = this;
        if (control) {
            control.tabIndex = disabled ? -1 : 0;
            control.ariaDisabled = disabled ? "true" : null;
        }
        if (disabled) {
            this.close();
        }
    }

    /**
     * The label of the element and its outside labels name the control. Called when it connects and gets the focus, since the outside labels
     * can't be observed. A label that is empty gives no name, so the author's `aria-label` names the control then.
     */
    public labelsChanged(): void {
        const { control, label } = this;
        if (control) {
            const outside = Array.from(this.internals.labels).filter((node): node is Element => node instanceof Element);
            const labels = label ? [label, ...outside] : outside;
            control.ariaLabelledByElements = labels.length > 0 ? labels : null;
        }
    }

    private readonly handleLabelClick = (): void => {
        this.control?.focus();
    };

    /**
     * The form was reset: the options are selected as by default.
     */
    public formReset(): void {
        for (const option of this.list.all) {
            option.selected = option.defaultSelected;
        }
        this.list.setOptions(this.list.all);
        this.selectDefault();
        this.update();
    }

    /**
     * Opens the popup, with the selected option active.
     */
    public show(): void {
        if (!this.disabled && this.listbox && this.control && !this.open) {
            this.listbox.showPopover({ source: this.control });
        }
    }

    /**
     * Closes the popup.
     */
    public close(): void {
        if (this.open) {
            this.listbox?.hidePopover();
        }
    }

    private selectDefault(): void {
        if (this.list.selected.length === 0) {
            const first = this.list.all.find(option => !option.disabled);
            if (first) {
                first.selected = true;
            }
        }
    }

    // The value, and the validity: a required select needs a selected option with a value, as a native one does. A read only one isn't
    // validated.
    private update(): void {
        const { host, internals } = this;
        const { value } = this.list;
        internals.setFormValue(this.list.selected.length > 0 ? value : null);
        if (host.required && !host.readOnly && value === "") {
            internals.setValidity({ valueMissing: true }, this.valueMissingMessage(), this.control ?? undefined);
        } else {
            internals.setValidity({});
        }
    }

    // The browser's message for a required select without a value, in the browser's language.
    private valueMissingMessage(): string {
        const select = this.host.ownerDocument.createElement("select");
        select.required = true;
        return select.validationMessage;
    }

    private selectActive(): void {
        if (this.list.active) {
            this.list.selectByUser(this.list.active);
        }
    }

    // The keys of the ARIA select-only combobox.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented) {
            return;
        }
        const { key } = event;

        if (!this.open) {
            if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " " || key === "Home" || key === "End") {
                event.preventDefault();
                this.show();
                if (key === "Home" || key === "End") {
                    this.list.handleKeydown(event);
                }
            } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                this.show();
                this.list.handleKeydown(event);
            }
            return;
        }

        if (key === "Enter" || (key === " " && !this.list.typing) || (key === "ArrowUp" && event.altKey)) {
            event.preventDefault();
            this.selectActive();
            this.close();
        } else if (key === "Tab") {
            this.selectActive();
            this.close();
        } else if (key === "Escape") {
            event.preventDefault();
            this.close();
        } else {
            this.list.handleKeydown(event);
        }
    };

    private readonly handleControlClick = (): void => {
        if (this.open) {
            this.close();
        } else {
            this.show();
        }
    };

    private readonly handleListboxClick = (event: MouseEvent): void => {
        const option = this.list.all.find(option => option === event.target || option.contains(event.target as Node));
        if (option && !option.disabled) {
            this.list.setActive(option);
            this.list.selectByUser(option);
            this.close();
        }
    };

    // A click in the popup keeps the focus on the control.
    private readonly handleListboxMousedown = (event: MouseEvent): void => {
        event.preventDefault();
    };

    private readonly handleFocus = (): void => {
        this.labelsChanged();
    };

    // The popup opened or closed, by the select or by the browser (Escape, a click outside).
    private readonly handleToggle = (): void => {
        const { open } = this;
        if (this.control) {
            this.control.ariaExpanded = open ? "true" : "false";
        }
        if (open) {
            this.internals.states.add("open");
            this.list.activateSelected();
        } else {
            this.internals.states.delete("open");
            this.list.setActive(null);
        }
    };
}
