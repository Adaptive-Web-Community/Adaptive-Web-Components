import type { Orientation } from "./orientation.js";

/**
 * The arrow keys a {@link RovingFocusController} moves with: those of an orientation, or all four.
 *
 * @public
 */
export type RovingFocusKeys = Orientation | "both";

/**
 * The options of a {@link RovingFocusController}.
 *
 * @public
 */
export type RovingFocusOptions<T extends HTMLElement = HTMLElement> = {
    /**
     * The arrow keys that move: Left and Right for `horizontal` (swapped right to left), Up and Down for `vertical`, or all four.
     */
    keys: RovingFocusKeys;

    /**
     * Whether Home and End move to the first and the last item that isn't disabled.
     */
    homeEnd?: boolean;

    /**
     * What else to do when the focus moves to an item, such as checking the radio it moved to.
     */
    onMove?: (item: T) => void;

    /**
     * Whether an item is disabled, which the focus skips. The default is whether it is `:disabled`.
     */
    isDisabled?: (item: T) => boolean;
};

/**
 * Focus that roves among the items of a composite (a radio group, a tablist): one item is in the tab order (`tabindex="0"`), the active one, or
 * the first that isn't disabled, and the arrow keys move the focus between them, wrapping, and skipping those that are disabled
 * (`:disabled`, or as the options say), and Home and End when the options say.
 *
 * @remarks
 * The composite's controller creates it, connects and disconnects it with its own, and gives it the items and the active item as they change.
 * A key is handled when its target is an item, so a key in an item's content isn't taken.
 *
 * @public
 */
export class RovingFocusController<T extends HTMLElement = HTMLElement> {
    private items: readonly T[] = [];
    private active: T | null = null;
    private keys: RovingFocusKeys;

    constructor(private readonly host: HTMLElement, private readonly options: RovingFocusOptions<T>) {
        this.keys = options.keys;
    }

    /**
     * Starts handling the arrow keys. For when the composite is connected.
     */
    public connect(): void {
        this.host.addEventListener("keydown", this.handleKeydown);
    }

    /**
     * Stops handling the arrow keys. For when the composite is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("keydown", this.handleKeydown);
    }

    /**
     * The items changed.
     */
    public setItems(items: readonly T[]): void {
        this.items = items;
        this.update();
    }

    /**
     * The active item, which is in the tab order, changed. `null` is the first item that isn't disabled.
     */
    public setActive(item: T | null): void {
        this.active = item;
        this.update();
    }

    /**
     * The arrow keys that move changed, with the composite's orientation.
     */
    public setKeys(keys: RovingFocusKeys): void {
        this.keys = keys;
    }

    private enabledItems(): T[] {
        const isDisabled = this.options.isDisabled ?? ((item: T) => item.matches(":disabled"));
        return this.items.filter(item => !isDisabled(item));
    }

    private update(): void {
        const enabled = this.enabledItems();
        const active = this.active && enabled.includes(this.active) ? this.active : enabled[0];
        for (const item of this.items) {
            item.tabIndex = item === active ? 0 : -1;
        }
    }

    private step(key: string): number {
        const { keys } = this;
        if (keys !== "vertical" && (key === "ArrowRight" || key === "ArrowLeft")) {
            const forward = key === "ArrowRight" ? 1 : -1;
            return getComputedStyle(this.host).direction === "rtl" ? -forward : forward;
        }
        if (keys !== "horizontal" && (key === "ArrowDown" || key === "ArrowUp")) {
            return key === "ArrowDown" ? 1 : -1;
        }
        return 0;
    }

    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented) {
            return;
        }

        const enabled = this.enabledItems();
        const index = enabled.findIndex(item => item === event.target);
        if (index < 0) {
            return;
        }

        let next: T;
        if (this.options.homeEnd && (event.key === "Home" || event.key === "End")) {
            next = event.key === "Home" ? enabled[0] : enabled[enabled.length - 1];
        } else {
            const step = this.step(event.key);
            if (step === 0) {
                return;
            }
            next = enabled[(index + step + enabled.length) % enabled.length];
        }

        event.preventDefault();
        this.setActive(next);
        next.focus();
        this.options.onMove?.(next);
    };
}
