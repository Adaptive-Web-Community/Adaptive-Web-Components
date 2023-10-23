import { FASTTextField } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Text field. Extends {@link @microsoft/fast-foundation#FASTTextField}.
 *
 * @public
 */
export class AdaptiveTextField extends FASTTextField {
    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
