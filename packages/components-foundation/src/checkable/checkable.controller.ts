import { SpacePressController } from "../utilities/space-press.controller.js";
import type { CheckableElement, CheckableRole } from "./checkable.js";

/**
 * What a {@link CheckableController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type CheckableInternals = Pick<
    ElementInternals,
    "role" | "ariaChecked" | "ariaReadOnly" | "ariaRequired" | "form" | "setFormValue" | "setValidity"
> & {
    readonly states: Pick<CustomStateSet, "add" | "delete">;
};

/**
 * The behavior that a checkbox, a switch, and a radio share, which a native checkbox has and a custom element doesn't: the role, focus,
 * checking by a click and by Space, the `checked` state and form value, the default from the `checked` attribute, reset, and read only.
 *
 * @remarks
 * The element's binding creates it (or the controller of the component that extends it) with the element's `ElementInternals`, calls
 * {@link CheckableController.connect} and {@link CheckableController.disconnect} with the element's lifecycle, calls
 * {@link CheckableController.defaultCheckedChanged} when the `checked` attribute changes, {@link CheckableController.stateChanged} when
 * anything else of the contract changes, and {@link CheckableController.formReset} from `formResetCallback`.
 *
 * @public
 */
export class CheckableController<T extends CheckableElement = CheckableElement> {
    // Whether the user or code changed `checked`, after which the `checked` attribute no longer sets it, as for a native checkbox.
    private dirty = false;
    private readonly spacePress: SpacePressController;

    constructor(protected readonly host: T, protected readonly internals: CheckableInternals, role: CheckableRole) {
        internals.role = role;
        this.spacePress = new SpacePressController(host, internals.states);
    }

    /**
     * Makes the element focusable, unless the author set its `tabindex`, and starts handling clicks and Space. For when the element is
     * connected.
     */
    public connect(): void {
        if (!this.host.hasAttribute("tabindex")) {
            this.host.tabIndex = 0;
        }

        this.host.addEventListener("click", this.handleClick);
        this.spacePress.connect();
        this.stateChanged();
    }

    /**
     * Stops handling clicks and Space. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("click", this.handleClick);
        this.spacePress.disconnect();
    }

    /**
     * The `checked` attribute changed. It sets `checked` until the user or code changes `checked`.
     */
    public defaultCheckedChanged(): void {
        if (!this.dirty) {
            this.host.checked = this.host.defaultChecked;
        }
    }

    /**
     * Something of the contract other than the `checked` attribute changed: updates the ARIA, the states, the form value, and the validity.
     */
    public stateChanged(): void {
        const { host, internals } = this;

        internals.ariaChecked = this.ariaChecked();
        if (host.checked) {
            internals.states.add("checked");
        } else {
            internals.states.delete("checked");
        }
        internals.setFormValue(host.checked ? host.value : null);

        const readOnly = this.readOnly();
        internals.ariaReadOnly = readOnly ? "true" : null;
        if (readOnly) {
            internals.states.add("readonly");
        } else {
            internals.states.delete("readonly");
        }

        const valueMissing = this.valueMissing();
        internals.ariaRequired = this.required() ? "true" : null;
        if (valueMissing) {
            internals.setValidity({ valueMissing }, this.valueMissingMessage());
        } else {
            internals.setValidity({});
        }
    }

    /**
     * The element's form was reset: it is checked by default again, and the `checked` attribute sets it again.
     */
    public formReset(): void {
        this.dirty = false;
        this.host.checked = this.host.defaultChecked;
        this.stateChanged();
    }

    /**
     * What a click does. Returns whether it changed anything, which emits `input` and `change`.
     */
    protected activate(): boolean {
        this.host.checked = !this.host.checked;
        return true;
    }

    /**
     * The value of `aria-checked`.
     */
    protected ariaChecked(): string {
        return `${this.host.checked}`;
    }

    /**
     * Whether the element is required, as a component of it says.
     */
    protected required(): boolean {
        return false;
    }

    /**
     * Whether the element is read only, as a component of it says: it takes focus, and isn't checked or unchecked by the user.
     */
    protected readOnly(): boolean {
        return false;
    }

    /**
     * Whether the element is required and has no value. A read only element isn't validated, as a read only native input isn't.
     */
    protected valueMissing(): boolean {
        return this.required() && !this.readOnly() && !this.host.checked;
    }

    /**
     * The browser's message for a required checkbox that isn't checked, in the browser's language.
     */
    protected valueMissingMessage(): string {
        const input = this.host.ownerDocument.createElement("input");
        input.type = "checkbox";
        input.required = true;
        return input.validationMessage;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        if (event.defaultPrevented || this.host.matches(":disabled") || this.readOnly()) {
            return;
        }

        this.dirty = true;
        if (this.activate()) {
            this.host.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
            this.host.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };
}
