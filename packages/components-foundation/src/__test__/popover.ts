// JSDOM has no popovers: an element that does what the HTML standard says a popover does, for what the controllers use, with a `toggle`
// event when it opens and closes.
export class TestPopover extends HTMLElement {
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
