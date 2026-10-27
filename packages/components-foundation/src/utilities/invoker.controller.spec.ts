import chai from "chai";
import type { InvokerElement } from "./invoker.js";
import { InvokerController } from "./invoker.controller.js";

const { expect } = chai;

class TestInvoker extends HTMLElement implements InvokerElement {
    public commandForElement: Element | null = null;
    public command: string | null = null;
}
customElements.define("test-invoker", TestInvoker);

// JSDOM has no popovers: this does what the HTML standard says a popover does, for what the controller uses.
class TestPopover extends HTMLElement {
    public readonly popover = "auto";
    public open = false;
    public source: HTMLElement | null = null;
    public togglePopover(options?: boolean | { source?: HTMLElement }): boolean {
        this.source = typeof options === "object" ? options.source ?? null : null;
        this.setOpen(!this.open);
        return this.open;
    }
    public showPopover(options?: { source?: HTMLElement }): void {
        this.source = options?.source ?? null;
        this.setOpen(true);
    }
    public hidePopover(): void {
        this.setOpen(false);
    }
    public matches(selector: string): boolean {
        return selector === ":popover-open" ? this.open : super.matches(selector);
    }
    private setOpen(open: boolean): void {
        this.open = open;
        this.dispatchEvent(new Event("toggle"));
    }
}
customElements.define("test-popover", TestPopover);

function setup(command: string) {
    const host = document.body.appendChild(new TestInvoker());
    const target = document.body.appendChild(new TestPopover());
    host.commandForElement = target;
    host.command = command;
    const internals = { ariaExpanded: null as string | null };
    const controller = new InvokerController(host, internals);
    return { host, target, internals, controller };
}

describe("InvokerController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should send the target a command event, with the command and the invoker", () => {
        const { host, target, controller } = setup("--refresh");
        let received: CommandEvent | null = null;
        target.addEventListener("command", event => (received = event));

        controller.invoke();

        expect(received!.command).to.equal("--refresh");
        expect(received!.source).to.equal(host);
    });

    it("should toggle a popover, with the invoker as its source", () => {
        const { host, target, controller } = setup("toggle-popover");

        controller.invoke();
        expect(target.open).to.be.true;
        expect(target.source).to.equal(host);

        controller.invoke();
        expect(target.open).to.be.false;
    });

    it("should show and hide a popover only when it isn't already", () => {
        const { host, target, controller } = setup("show-popover");

        controller.invoke();
        controller.invoke();
        expect(target.open).to.be.true;

        host.command = "hide-popover";
        controller.invoke();
        expect(target.open).to.be.false;
    });

    it("should be expanded as its popover is open, a light dismiss too", () => {
        const { target, internals, controller } = setup("toggle-popover");

        controller.invoke();
        expect(internals.ariaExpanded).to.equal("true");

        target.hidePopover();
        expect(internals.ariaExpanded).to.equal("false");
    });

    it("should do nothing more when the command event is cancelled", () => {
        const { target, controller } = setup("toggle-popover");
        target.addEventListener("command", event => event.preventDefault());

        controller.invoke();

        expect(target.open).to.be.false;
    });

    it("should show and close a native dialog", () => {
        const { host, controller } = setup("show-modal");
        const dialog = document.body.appendChild(document.createElement("dialog"));
        let shown = 0;
        Object.assign(dialog, { showModal: () => shown++ });
        host.commandForElement = dialog;

        controller.invoke();

        expect(shown).to.equal(1);
    });

    it("should do nothing without a target", () => {
        const { host, controller } = setup("toggle-popover");
        host.commandForElement = null;

        expect(() => controller.invoke()).to.not.throw();
    });
});
