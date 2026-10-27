import { type ButtonElement, ButtonType } from "./button.js";

/**
 * What the {@link ButtonController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type ButtonInternals = Pick<ElementInternals, "form" | "role"> & {
    readonly states: Pick<CustomStateSet, "add" | "delete">;
};

/**
 * The behavior of a {@link ButtonElement} that a native button has and a custom element doesn't: the `button` role, focus, activation by Enter
 * and Space, and submitting or resetting its form.
 *
 * @remarks
 * The element's binding creates it with the element's `ElementInternals`, and calls {@link ButtonController.connect} and
 * {@link ButtonController.disconnect} with the element's lifecycle.
 *
 * Disabled is the platform's: a disabled form-associated element isn't focusable and isn't clicked by the user.
 *
 * @public
 */
export class ButtonController {
    private pressed = false;

    constructor(private readonly host: ButtonElement, private readonly internals: ButtonInternals) {
        internals.role = "button";
    }

    /**
     * Makes the button focusable, unless the author set its `tabindex`, and starts handling clicks and the keyboard. For when the element is
     * connected.
     */
    public connect(): void {
        if (!this.host.hasAttribute("tabindex")) {
            this.host.tabIndex = 0;
        }

        this.host.addEventListener("click", this.handleClick);
        this.host.addEventListener("keydown", this.handleKeydown);
        this.host.addEventListener("keyup", this.handleKeyup);
        this.host.addEventListener("blur", this.handleBlur);
    }

    /**
     * Stops handling clicks and the keyboard. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("click", this.handleClick);
        this.host.removeEventListener("keydown", this.handleKeydown);
        this.host.removeEventListener("keyup", this.handleKeyup);
        this.host.removeEventListener("blur", this.handleBlur);
        this.release();
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const form = this.internals.form;
        if (event.defaultPrevented || !form || this.host.matches(":disabled")) {
            return;
        }

        switch (this.host.type) {
            case ButtonType.submit:
                this.submit(form);
                break;
            case ButtonType.reset:
                form.reset();
                break;
        }
    };

    // As a native button: Enter clicks when it is pressed, and Space when it is released, unless the focus left in between.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.target !== this.host || event.defaultPrevented) {
            return;
        }

        switch (event.key) {
            case "Enter":
                this.host.click();
                break;
            case " ":
                // Space would scroll the page.
                event.preventDefault();
                this.press();
                break;
        }
    };

    private readonly handleKeyup = (event: KeyboardEvent): void => {
        if (event.target === this.host && event.key === " " && this.pressed) {
            this.release();
            this.host.click();
        }
    };

    private readonly handleBlur = (): void => {
        this.release();
    };

    private press(): void {
        this.pressed = true;
        this.internals.states.add("active");
    }

    private release(): void {
        this.pressed = false;
        this.internals.states.delete("active");
    }

    // `requestSubmit` takes only a native submit button as the submitter (WICG/webcomponents#814), and the submitter carries the name, the
    // value, and the overrides of the form's attributes. So a hidden one is in the form for the time of the submission.
    private submit(form: HTMLFormElement): void {
        const submitter = form.ownerDocument.createElement("button");
        submitter.type = "submit";
        submitter.hidden = true;
        submitter.formNoValidate = this.host.formNoValidate;

        const attributes: [string, string | null][] = [
            ["name", this.host.name],
            ["value", this.host.value],
            ["formaction", this.host.formAction],
            ["formenctype", this.host.formEnctype],
            ["formmethod", this.host.formMethod],
            ["formtarget", this.host.formTarget],
        ];
        for (const [name, value] of attributes) {
            if (value !== null) {
                submitter.setAttribute(name, value);
            }
        }

        form.append(submitter);
        try {
            form.requestSubmit(submitter);
        } finally {
            submitter.remove();
        }
    }
}
