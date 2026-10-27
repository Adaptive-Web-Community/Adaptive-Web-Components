import chai from "chai";
import { TestInternals } from "../__test__/internals.js";
import { type TooltipElement, TooltipPlacement } from "./tooltip.js";
import { TooltipController } from "./tooltip.controller.js";

const { expect } = chai;

// JSDOM has no popovers: this does what the HTML standard says a popover does, for what the controller uses.
class TestTooltip extends HTMLElement implements TooltipElement {
    public anchorElement: Element | null = null;
    public placement: TooltipPlacement = TooltipPlacement.above;
    public delay = 0;
    public popover: string | null = null;
    public open = false;
    public source: HTMLElement | null = null;
    public showPopover(options?: { source?: HTMLElement }): void {
        this.open = true;
        this.source = options?.source ?? null;
    }
    public hidePopover(): void {
        this.open = false;
    }
    public matches(selector: string): boolean {
        return selector === ":popover-open" ? this.open : super.matches(selector);
    }
}
customElements.define("test-tooltip", TestTooltip);

const delay = () => new Promise(resolve => setTimeout(resolve, 5));

function setup() {
    const anchor = document.body.appendChild(document.createElement("button"));
    const host = document.body.appendChild(new TestTooltip());
    host.anchorElement = anchor;
    const internals = new TestInternals();
    const controller = new TooltipController(host, internals);
    controller.connect();
    return { anchor, host, internals, controller };
}

describe("TooltipController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should be a manual popover with the tooltip role", () => {
        const { host, internals } = setup();

        expect(internals.role).to.equal("tooltip");
        expect(host.popover).to.equal("manual");
    });

    it("should describe its anchor, after what the anchor had, and stop when it disconnects", () => {
        const anchor = document.body.appendChild(document.createElement("button"));
        const hint = document.body.appendChild(document.createElement("p"));
        anchor.ariaDescribedByElements = [hint];
        const host = document.body.appendChild(new TestTooltip());
        host.anchorElement = anchor;
        const controller = new TooltipController(host, new TestInternals());

        controller.connect();
        expect(anchor.ariaDescribedByElements).to.deep.equal([hint, host]);

        controller.disconnect();
        expect(anchor.ariaDescribedByElements).to.deep.equal([hint]);
    });

    it("should show while its anchor has the focus, with the anchor as its source", () => {
        const { anchor, host } = setup();

        anchor.dispatchEvent(new FocusEvent("focusin"));
        expect(host.open).to.be.true;
        expect(host.source).to.equal(anchor);

        anchor.dispatchEvent(new FocusEvent("focusout"));
        expect(host.open).to.be.false;
    });

    it("should show after the delay while the pointer is on its anchor, and stay while it is on the tooltip", async () => {
        const { anchor, host } = setup();

        anchor.dispatchEvent(new Event("pointerenter"));
        expect(host.open).to.be.false;
        await delay();
        expect(host.open).to.be.true;

        anchor.dispatchEvent(new Event("pointerleave"));
        host.dispatchEvent(new Event("pointerenter"));
        await delay();
        expect(host.open).to.be.true;

        host.dispatchEvent(new Event("pointerleave"));
        await delay();
        expect(host.open).to.be.false;
    });

    it("should hide on Escape", () => {
        const { anchor, host } = setup();
        anchor.dispatchEvent(new FocusEvent("focusin"));

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

        expect(host.open).to.be.false;
    });

    it("should follow a new anchor", () => {
        const { anchor, host, controller } = setup();
        const other = document.body.appendChild(document.createElement("button"));

        host.anchorElement = other;
        controller.anchorChanged();
        anchor.dispatchEvent(new FocusEvent("focusin"));
        expect(host.open).to.be.false;

        other.dispatchEvent(new FocusEvent("focusin"));
        expect(host.open).to.be.true;
        expect(anchor.ariaDescribedByElements).to.deep.equal([]);
        expect(other.ariaDescribedByElements).to.deep.equal([host]);
    });
});
