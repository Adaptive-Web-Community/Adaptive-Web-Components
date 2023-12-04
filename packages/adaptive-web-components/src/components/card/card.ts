import { attr } from "@microsoft/fast-element";
import { FASTCard } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Card. Extends {@link @microsoft/fast-foundation#FASTCard}.
 *
 * @public
 */
export class AdaptiveCard extends FASTCard {
    /**
     * Disables an `interactive` Card.
     *
     * @public
     * @defaultValue - false
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean = false;

    /**
     * Indicates that the Card is interactive.
     *
     * @public
     * @defaultValue - false
     * @remarks
     * HTML Attribute: interactive
     */
    @attr({ attribute: "interactive", mode: "boolean" })
    public interactive: boolean = false;
    public interactiveChanged(prev?: boolean, next?: boolean): void {
        if (next) {
            this.setAttribute("tabindex", "0");
            this.setupRole();
        } else {
            this.removeAttribute("tabindex");
            this.removeAttribute("role");
        }
    }

    private setupRole(): void {
        if (this.interactive && !this.role) {
            this.setAttribute("role", "button");
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        this.setupRole();
    }
}
