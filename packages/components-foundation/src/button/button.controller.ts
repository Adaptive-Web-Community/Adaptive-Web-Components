import { InvokerController } from "../utilities/invoker.controller.js";
import { SpacePressController } from "../utilities/space-press.controller.js";
import { type ButtonElement, ButtonType } from "./button.js";

/**
 * What the {@link ButtonController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type ButtonInternals = Pick<ElementInternals, "form" | "role" | "ariaExpanded"> & {
    readonly states: Pick<CustomStateSet, "add" | "delete">;
};

/**
 * The behavior of a {@link ButtonElement} that a native button has and a custom element doesn't: the `button` role, focus, activation by Enter
 * and Space, submitting or resetting its form, and, as a `button`, invoking the command of `commandfor` and `command` (with an
 * {@link InvokerController}).
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
    private readonly spacePress: SpacePressController;
    private readonly invoker: InvokerController;

    constructor(private readonly host: ButtonElement, private readonly internals: ButtonInternals) {
        internals.role = "button";
        this.spacePress = new SpacePressController(host, internals.states);
        this.invoker = new InvokerController(host, internals);
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
        this.spacePress.connect();
    }

    /**
     * Stops handling clicks and the keyboard. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("click", this.handleClick);
        this.host.removeEventListener("keydown", this.handleKeydown);
        this.spacePress.disconnect();
        this.invoker.disconnect();
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const form = this.internals.form;
        if (event.defaultPrevented || this.host.matches(":disabled")) {
            return;
        }

        // As a native button: a submit or reset button acts on its form, and only a `button` invokes a command.
        switch (this.host.type) {
            case ButtonType.submit:
                if (form) {
                    this.submit(form);
                }
                break;
            case ButtonType.reset:
                form?.reset();
                break;
            case ButtonType.button:
                this.invoker.invoke();
                break;
        }
    };

    // As a native button: Enter clicks when it is pressed. Space clicks when it is released, by the SpacePressController.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.target === this.host && !event.defaultPrevented && event.key === "Enter") {
            this.host.click();
        }
    };

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
