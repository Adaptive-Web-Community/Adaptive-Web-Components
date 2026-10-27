import "../utilities/dom.js";
import type { TooltipElement } from "./tooltip.js";

/**
 * What a {@link TooltipController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type TooltipInternals = Pick<ElementInternals, "role">;

/**
 * The behavior of a {@link TooltipElement}: the `tooltip` role, the host a manual popover, shown with its anchor as the source (its implicit
 * anchor for CSS anchor positioning) while the anchor has the focus or the pointer (after the delay), kept while the pointer is over it, and
 * hidden by Escape; and the anchor described by it.
 *
 * @remarks
 * The element's binding creates it, calls {@link TooltipController.connect} and {@link TooltipController.disconnect} with the element's
 * lifecycle, and {@link TooltipController.anchorChanged} when the anchor changes.
 *
 * @public
 */
export class TooltipController {
    private anchor: HTMLElement | null = null;
    private timer: ReturnType<typeof setTimeout> | undefined;

    constructor(private readonly host: TooltipElement, internals: TooltipInternals) {
        internals.role = "tooltip";
    }

    /**
     * Makes the element a manual popover, unless the author gave it a `popover`, and starts following its anchor. For when it is connected.
     */
    public connect(): void {
        if (this.host.popover === null) {
            this.host.popover = "manual";
        }
        this.host.addEventListener("pointerenter", this.handlePointerEnter);
        this.host.addEventListener("pointerleave", this.handlePointerLeave);
        this.anchorChanged();
    }

    /**
     * Stops following its anchor, which it no longer describes. For when it is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("pointerenter", this.handlePointerEnter);
        this.host.removeEventListener("pointerleave", this.handlePointerLeave);
        this.follow(null);
        clearTimeout(this.timer);
    }

    /**
     * The anchor changed.
     */
    public anchorChanged(): void {
        const anchor = this.host.anchorElement;
        this.follow(anchor instanceof HTMLElement ? anchor : null);
    }

    private follow(anchor: HTMLElement | null): void {
        const previous = this.anchor;
        if (anchor === previous) {
            return;
        }

        if (previous) {
            previous.removeEventListener("focusin", this.handleFocusIn);
            previous.removeEventListener("focusout", this.handleFocusOut);
            previous.removeEventListener("pointerenter", this.handlePointerEnter);
            previous.removeEventListener("pointerleave", this.handlePointerLeave);
            previous.ariaDescribedByElements = (previous.ariaDescribedByElements ?? []).filter(element => element !== this.host);
            this.hide();
        }

        this.anchor = anchor;

        if (anchor) {
            anchor.addEventListener("focusin", this.handleFocusIn);
            anchor.addEventListener("focusout", this.handleFocusOut);
            anchor.addEventListener("pointerenter", this.handlePointerEnter);
            anchor.addEventListener("pointerleave", this.handlePointerLeave);
            // Added to what the author's own `aria-describedby` has, which the property gives as elements.
            const described = anchor.ariaDescribedByElements ?? [];
            if (!described.includes(this.host)) {
                anchor.ariaDescribedByElements = [...described, this.host];
            }
        }
    }

    private show(): void {
        clearTimeout(this.timer);
        if (this.anchor && !this.host.matches(":popover-open")) {
            this.host.showPopover({ source: this.anchor });
            this.host.ownerDocument.addEventListener("keydown", this.handleKeydown);
        }
    }

    private hide(): void {
        clearTimeout(this.timer);
        if (this.host.matches(":popover-open")) {
            this.host.hidePopover();
        }
        this.host.ownerDocument.removeEventListener("keydown", this.handleKeydown);
    }

    private later(action: () => void): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(action, this.host.delay);
    }

    private readonly handleFocusIn = (): void => {
        this.show();
    };

    private readonly handleFocusOut = (): void => {
        this.hide();
    };

    // The pointer on the anchor or on the tooltip keeps it; leaving both hides it, after the delay.
    private readonly handlePointerEnter = (): void => {
        if (this.host.matches(":popover-open")) {
            clearTimeout(this.timer);
        } else {
            this.later(() => this.show());
        }
    };

    private readonly handlePointerLeave = (): void => {
        this.later(() => this.hide());
    };

    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape" && !event.defaultPrevented) {
            this.hide();
        }
    };
}
