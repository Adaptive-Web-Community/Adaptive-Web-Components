import "./dom.js";
import type { InvokerElement } from "./invoker.js";

/**
 * What an {@link InvokerController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type InvokerInternals = Pick<ElementInternals, "ariaExpanded">;

/**
 * The Invoker Commands API for an {@link InvokerElement} that isn't a native `<button>`: the command is first a cancelable `command` event at
 * the target, which is how a custom element (a dialog of ours) or the author's command (`--...`) gets it, and then, unless it was cancelled,
 * what a native button does for a popover (`togglePopover` with the invoker as its source, which is the popover's implicit anchor) or a
 * native `<dialog>`. While its target is a popover, the invoker is `aria-expanded` as the popover is open.
 *
 * @remarks
 * The element's controller creates it and calls {@link InvokerController.invoke} when the element is activated, and
 * {@link InvokerController.disconnect} with the element's lifecycle.
 *
 * @public
 */
export class InvokerController {
    private popover: HTMLElement | null = null;

    constructor(private readonly host: InvokerElement, private readonly internals: InvokerInternals) {}

    /**
     * Invokes the command on the target. Does nothing without a target or a command.
     */
    public invoke(): void {
        const { host } = this;
        const target = host.commandForElement;
        const command = host.command;
        if (!(target instanceof HTMLElement) || !command) {
            return;
        }

        const event = new CommandEvent("command", { command, source: host, cancelable: true });
        if (!target.dispatchEvent(event)) {
            return;
        }

        if (typeof target.popover === "string") {
            this.invokePopover(target, command);
        } else if (target instanceof HTMLDialogElement) {
            this.invokeDialog(target, command);
        }
    }

    /**
     * Stops following the popover's state. For when the element is disconnected.
     */
    public disconnect(): void {
        this.follow(null);
    }

    private invokePopover(popover: HTMLElement, command: string): void {
        this.follow(popover);
        const open = popover.matches(":popover-open");
        switch (command) {
            case "toggle-popover":
                popover.togglePopover({ source: this.host });
                break;
            case "show-popover":
                if (!open) {
                    popover.showPopover({ source: this.host });
                }
                break;
            case "hide-popover":
                if (open) {
                    popover.hidePopover();
                }
                break;
        }
    }

    private invokeDialog(dialog: HTMLDialogElement, command: string): void {
        switch (command) {
            case "show-modal":
                if (!dialog.open) {
                    dialog.showModal();
                }
                break;
            case "close":
                dialog.close();
                break;
            case "request-close":
                dialog.requestClose();
                break;
        }
    }

    // The invoker is expanded as its popover is open, which a light dismiss changes too.
    private follow(popover: HTMLElement | null): void {
        if (popover === this.popover) {
            return;
        }
        this.popover?.removeEventListener("toggle", this.handleToggle);
        this.popover = popover;
        this.internals.ariaExpanded = null;
        popover?.addEventListener("toggle", this.handleToggle);
    }

    private readonly handleToggle = (): void => {
        this.internals.ariaExpanded = this.popover?.matches(":popover-open") ? "true" : "false";
    };
}
