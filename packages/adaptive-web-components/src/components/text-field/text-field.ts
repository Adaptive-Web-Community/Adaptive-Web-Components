import { FASTTextField } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Text Field. Extends {@link @microsoft/fast-foundation#FASTTextField}.
 *
 * @public
 */
export class TextField extends FASTTextField {
    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
