import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import { DialogClosedBy, type DialogElement } from "./dialog.js";
import { DialogController } from "./dialog.controller.js";

const { expect } = chai;

class TestDialog extends HTMLElement implements DialogElement {
    public closedBy: DialogClosedBy = DialogClosedBy.closeRequest;
    public readonly open = false;
    public returnValue = "";
    public show(): void {}
    public showModal(): void {}
    public close(): void {}
}
customElements.define("test-dialog", TestDialog);

// JSDOM has no dialog methods: this does what the HTML standard says a <dialog> does, for what the controller uses.
class TestDialogControl extends HTMLElement {
    public open = false;
    public modal = false;
    public returnValue = "";
    public show(): void {
        this.open = true;
    }
    public showModal(): void {
        this.open = true;
        this.modal = true;
    }
    public close(returnValue?: string): void {
        if (!this.open) {
            return;
        }
        this.open = false;
        this.modal = false;
        if (returnValue !== undefined) {
            this.returnValue = returnValue;
        }
        this.dispatchEvent(new Event("close"));
    }
    // Escape: cancel, then close unless it was prevented.
    public escape(): void {
        if (this.dispatchEvent(new Event("cancel", { cancelable: true }))) {
            this.close();
        }
    }
}
customElements.define("test-dialog-control", TestDialogControl);

function setup(configure: (host: TestDialog) => void = () => {}) {
    const host = document.body.appendChild(new TestDialog());
    configure(host);
    const control = host.attachShadow({ mode: "open" }).appendChild(new TestDialogControl());
    const internals = new TestInternals();
    const controller = new DialogController(host, internals);
    controller.connect(control);
    return { host, control, internals, controller };
}

describe("DialogController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should open modal, with the open and modal states", () => {
        const { control, internals, controller } = setup();

        controller.showModal();

        expect(control.modal).to.be.true;
        expect(controller.open).to.be.true;
        expect(internals.states.has("open")).to.be.true;
        expect(internals.states.has("modal")).to.be.true;
    });

    it("should close with a value, and emit close from the element", () => {
        const { host, internals, controller } = setup();
        let closes = 0;
        host.addEventListener("close", () => closes++);
        controller.show();

        controller.close("saved");

        expect(controller.open).to.be.false;
        expect(controller.returnValue).to.equal("saved");
        expect(closes).to.equal(1);
        expect(internals.states.has("open")).to.be.false;
    });

    it("should focus an autofocus element of its content", () => {
        const { host, controller } = setup();
        const input = host.appendChild(document.createElement("input"));
        input.autofocus = true;

        controller.showModal();

        expect(document.activeElement).to.equal(input);
    });

    describe("cancel", () => {
        it("should emit cancel from the element on Escape, which can keep it open", () => {
            const { host, control, controller } = setup();
            host.addEventListener("cancel", event => event.preventDefault(), { once: true });
            controller.showModal();

            control.escape();
            expect(controller.open).to.be.true;

            control.escape();
            expect(controller.open).to.be.false;
        });

        it("should not close on Escape when closed by none", () => {
            const { control, controller } = setup(host => (host.closedBy = DialogClosedBy.none));
            controller.showModal();

            control.escape();

            expect(controller.open).to.be.true;
        });

        it("should close on a click outside when closed by any", () => {
            const { host, control, controller } = setup(host => (host.closedBy = DialogClosedBy.any));
            let cancels = 0;
            host.addEventListener("cancel", () => cancels++);
            controller.showModal();

            control.dispatchEvent(new MouseEvent("click", { clientX: 10, clientY: 10 }));

            expect(controller.open).to.be.false;
            expect(cancels).to.equal(1);
        });

        it("should not close on a click outside otherwise", () => {
            const { control, controller } = setup();
            controller.showModal();

            control.dispatchEvent(new MouseEvent("click", { clientX: 10, clientY: 10 }));

            expect(controller.open).to.be.true;
        });
    });

    describe("command", () => {
        function command(host: HTMLElement, name: string): void {
            const event = new Event("command");
            Object.defineProperty(event, "command", { value: name });
            host.dispatchEvent(event);
        }

        it("should open and close by an invoker's command, with or without --", () => {
            const { host, controller } = setup();

            command(host, "show-modal");
            expect(controller.open).to.be.true;

            command(host, "--close");
            expect(controller.open).to.be.false;
        });

        it("should ask to close by request-close", () => {
            const { host, controller } = setup();
            host.addEventListener("cancel", event => event.preventDefault());
            controller.showModal();

            command(host, "request-close");

            expect(controller.open).to.be.true;
        });
    });

    it("should forward the author's ARIA to the dialog", () => {
        const { control } = setup(host => host.setAttribute("aria-label", "Settings"));

        expect(control.getAttribute("aria-label")).to.equal("Settings");
    });
});
