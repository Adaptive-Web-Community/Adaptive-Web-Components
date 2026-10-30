import type { ListboxOptionElement } from "../listbox-option/listbox-option.js";
import { labelHost } from "../utilities/label.js";
import type { ListboxElement } from "./listbox.js";
import { OptionListController } from "./option-list.controller.js";

/**
 * What a {@link ListboxController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type ListboxInternals = Pick<
    ElementInternals,
    "role" | "ariaLabel" | "ariaLabelledByElements" | "ariaActiveDescendantElement" | "ariaMultiSelectable" | "ariaReadOnly" | "ariaRequired" | "ariaDisabled" | "setFormValue" | "setValidity"
>;

/**
 * The behavior of a {@link ListboxElement}: the `listbox` role; its options, with an {@link OptionListController}; the keys, a click on an
 * option, and the focus, which makes the selected option active; `input` and `change` for the user's changes; and its form value, validity,
 * and reset; and its name, from its label.
 *
 * @remarks
 * The element's binding creates it, calls {@link ListboxController.connect} and {@link ListboxController.disconnect} with the element's
 * lifecycle, and calls {@link ListboxController.setOptions}, {@link ListboxController.optionSelectedChanged}, {@link ListboxController.labelChanged},
 * {@link ListboxController.stateChanged} when `name`, `multiple`, `readOnly`, or `required` change, {@link ListboxController.disabledChanged}
 * from `formDisabledCallback`, and {@link ListboxController.formReset} from `formResetCallback`, when its framework observes those changes.
 *
 * @public
 */
export class ListboxController {
    /**
     * The options, the active one, and the selection.
     */
    public readonly list: OptionListController;

    constructor(private readonly host: ListboxElement, private readonly internals: ListboxInternals) {
        internals.role = "listbox";
        this.list = new OptionListController(host, {
            selectionFollowsFocus: true,
            onActiveChange: option => {
                internals.ariaActiveDescendantElement = option;
            },
            onUserChange: () => {
                this.update();
                host.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
                host.dispatchEvent(new Event("change", { bubbles: true }));
            },
        });
    }

    /**
     * Makes the element focusable, unless the author set its `tabindex`, and starts handling the keys, clicks, and focus. For when the element
     * is connected.
     */
    public connect(): void {
        if (!this.host.hasAttribute("tabindex")) {
            this.host.tabIndex = 0;
        }
        this.host.addEventListener("keydown", this.handleKeydown);
        this.host.addEventListener("click", this.handleClick);
        this.host.addEventListener("focus", this.handleFocus);
        this.stateChanged();
    }

    /**
     * Stops handling the keys, clicks, and focus. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("keydown", this.handleKeydown);
        this.host.removeEventListener("click", this.handleClick);
        this.host.removeEventListener("focus", this.handleFocus);
    }

    /**
     * The `label` attribute or the elements in the `label` slot changed. They name the listbox.
     */
    public labelChanged(label: string | null, labelElements: readonly Element[]): void {
        labelHost(this.internals, label, labelElements);
    }

    /**
     * The options changed.
     */
    public setOptions(options: readonly ListboxOptionElement[]): void {
        this.list.setOptions(options);
        this.update();
    }

    /**
     * An option was selected or unselected, by the user or by code.
     */
    public optionSelectedChanged(option: ListboxOptionElement): void {
        this.list.optionSelectedChanged(option);
        this.update();
    }

    /**
     * The name, multiple, read only, or required changed.
     */
    public stateChanged(): void {
        const { host, internals } = this;
        internals.ariaMultiSelectable = host.multiple ? "true" : null;
        internals.ariaReadOnly = host.readOnly ? "true" : null;
        internals.ariaRequired = host.required ? "true" : null;
        if (!host.multiple) {
            this.list.setOptions(this.list.all);
        }
        this.update();
    }

    /**
     * The element was disabled or enabled, by its `disabled` attribute or a fieldset around it.
     */
    public disabledChanged(disabled: boolean): void {
        this.internals.ariaDisabled = disabled ? "true" : null;
    }

    /**
     * The form was reset: each option is selected as by default.
     */
    public formReset(): void {
        for (const option of this.list.all) {
            option.selected = option.defaultSelected;
        }
        this.list.setOptions(this.list.all);
        this.update();
    }

    // The selected options' values, under the element's name, and its validity: a required listbox needs a selected option. A read only
    // one isn't validated.
    private update(): void {
        const { host, internals } = this;
        const selected = this.list.selected;
        if (host.name !== null && selected.length > 0) {
            const data = new FormData();
            for (const option of selected) {
                data.append(host.name, option.value);
            }
            internals.setFormValue(data);
        } else {
            internals.setFormValue(null);
        }

        if (host.required && !host.readOnly && selected.length === 0) {
            internals.setValidity({ valueMissing: true }, this.valueMissingMessage());
        } else {
            internals.setValidity({});
        }
    }

    // The browser's message for a required select without a selection, in the browser's language.
    private valueMissingMessage(): string {
        const select = this.host.ownerDocument.createElement("select");
        select.multiple = true;
        select.required = true;
        return select.validationMessage;
    }

    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented || event.target !== this.host) {
            return;
        }
        this.list.handleKeydown(event);
    };

    private readonly handleClick = (event: MouseEvent): void => {
        if (this.host.matches(":disabled")) {
            return;
        }
        const option = this.list.all.find(option => option === event.target || option.contains(event.target as Node));
        if (option && !option.disabled) {
            this.list.setActive(option);
            this.list.selectByUser(option);
        }
    };

    // The focus makes the selected option active, or the first, so that the keys start from it.
    private readonly handleFocus = (): void => {
        if (!this.list.active) {
            this.list.activateSelected();
        }
    };
}
