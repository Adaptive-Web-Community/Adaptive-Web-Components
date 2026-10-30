/**
 * Space on an element as on a native button or checkbox: the element is `:state(active)` while Space is held, since a custom element isn't
 * `:active` then, and it is clicked when Space is released, unless the focus left in between.
 *
 * @remarks
 * Only a key on the element itself is handled (not one in its content), and not one whose default was already prevented. Space doesn't scroll
 * the page. The element's controller creates it and connects and disconnects it with its own.
 *
 * @public
 */
export class SpacePressController {
    private pressed = false;

    constructor(private readonly host: HTMLElement, private readonly states: Pick<CustomStateSet, "add" | "delete">) {}

    /**
     * Starts handling Space. For when the element is connected.
     */
    public connect(): void {
        this.host.addEventListener("keydown", this.handleKeydown);
        this.host.addEventListener("keyup", this.handleKeyup);
        this.host.addEventListener("blur", this.handleBlur);
    }

    /**
     * Stops handling Space. For when the element is disconnected.
     */
    public disconnect(): void {
        this.host.removeEventListener("keydown", this.handleKeydown);
        this.host.removeEventListener("keyup", this.handleKeyup);
        this.host.removeEventListener("blur", this.handleBlur);
        this.release();
    }

    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.target === this.host && !event.defaultPrevented && event.key === " ") {
            event.preventDefault();
            this.pressed = true;
            this.states.add("active");
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

    private release(): void {
        this.pressed = false;
        this.states.delete("active");
    }
}
