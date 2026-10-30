import "../utilities/dom.js";
import { AriaForwardingController } from "../utilities/aria-forwarding.controller.js";
import { DialogClosedBy, type DialogElement } from "./dialog.js";

/**
 * What a {@link DialogController} uses of the native `<dialog>`.
 *
 * @public
 */
export type DialogControl = HTMLElement & Pick<HTMLDialogElement, "open" | "returnValue" | "show" | "showModal" | "close">;

/**
 * What a {@link DialogController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type DialogInternals = {
    readonly states: Pick<CustomStateSet, "add" | "delete">;
};

/**
 * The behavior of a {@link DialogElement} around its native `<dialog>`: opening and closing it, `cancel` and `close` from the host,
 * `closedby` done for every browser, the `command` of an invoker, the author's ARIA forwarded to the `<dialog>`, and focus moved to an
 * `autofocus` element of the content.
 *
 * @remarks
 * The binding creates it, calls {@link DialogController.connect} with the `<dialog>` once the template rendered and
 * {@link DialogController.disconnect} with the element's lifecycle, and calls its methods for the element's.
 *
 * @public
 */
export class DialogController {
    private control: DialogControl | null = null;
    private readonly ariaForwarding: AriaForwardingController;

    constructor(private readonly host: DialogElement, private readonly internals: DialogInternals) {
        this.ariaForwarding = new AriaForwardingController(host);
    }

    /**
     * Starts handling the `<dialog>`'s events and the invokers' commands. For when the element is connected and has rendered.
     */
    public connect(control: DialogControl): void {
        this.control = control;
        control.addEventListener("cancel", this.handleCancel);
        control.addEventListener("close", this.handleClose);
        control.addEventListener("click", this.handleClick);
        this.host.addEventListener("command", this.handleCommand);
        this.ariaForwarding.connect(control);
    }

    /**
     * Stops handling events. For when the element is disconnected.
     */
    public disconnect(): void {
        const { control } = this;
        if (control) {
            control.removeEventListener("cancel", this.handleCancel);
            control.removeEventListener("close", this.handleClose);
            control.removeEventListener("click", this.handleClick);
        }
        this.host.removeEventListener("command", this.handleCommand);
        this.ariaForwarding.disconnect();
    }

    /**
     * Whether the dialog is open.
     */
    public get open(): boolean {
        return this.control?.open ?? false;
    }

    /**
     * The value the dialog closed with.
     */
    public get returnValue(): string {
        return this.control?.returnValue ?? "";
    }
    public set returnValue(value: string) {
        if (this.control) {
            this.control.returnValue = value;
        }
    }

    /**
     * Opens the dialog, not modal.
     */
    public show(): void {
        this.control?.show();
        this.opened(false);
    }

    /**
     * Opens the dialog as modal.
     */
    public showModal(): void {
        this.control?.showModal();
        this.opened(true);
    }

    /**
     * Closes the dialog, with the value it closed with.
     */
    public close(returnValue?: string): void {
        this.control?.close(returnValue);
    }

    /**
     * Asks to close the dialog, as Escape does: `cancel` first, which can keep it open.
     */
    public requestClose(): void {
        if (this.open && this.cancel()) {
            this.close();
        }
    }

    private opened(modal: boolean): void {
        const { states } = this.internals;
        states.add("open");
        if (modal) {
            states.add("modal");
        }

        // The browser moves the focus into the dialog, but doesn't look in its slots for `autofocus`.
        const autofocus = this.host.querySelector("[autofocus]");
        if (autofocus instanceof HTMLElement) {
            autofocus.focus();
        }
    }

    // Emits `cancel` from the element. Returns whether the dialog may close.
    private cancel(): boolean {
        return this.host.dispatchEvent(new Event("cancel", { cancelable: true }));
    }

    // The `<dialog>`'s cancel (Escape): the element's `cancel` and `closedby` decide.
    private readonly handleCancel = (event: Event): void => {
        if (this.host.closedBy === DialogClosedBy.none || !this.cancel()) {
            event.preventDefault();
        }
    };

    // The `<dialog>`'s close doesn't leave the shadow root.
    private readonly handleClose = (): void => {
        this.internals.states.delete("open");
        this.internals.states.delete("modal");
        this.host.dispatchEvent(new Event("close"));
    };

    // A click outside the dialog's box is on its backdrop, which targets the `<dialog>`.
    private readonly handleClick = (event: MouseEvent): void => {
        const { control } = this;
        if (!control || event.target !== control || this.host.closedBy !== DialogClosedBy.any) {
            return;
        }

        const box = control.getBoundingClientRect();
        const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
        if (outside) {
            this.requestClose();
        }
    };

    private readonly handleCommand = (event: CommandEvent): void => {
        switch (event.command) {
            case "show-modal":
            case "--show-modal":
                this.showModal();
                break;
            case "close":
            case "--close":
                this.close();
                break;
            case "request-close":
            case "--request-close":
                this.requestClose();
                break;
        }
    };
}
