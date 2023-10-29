import { FASTNumberField } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Number Field. Extends {@link @microsoft/fast-foundation#FASTNumberField}.
 *
 * @public
 */
export class AdaptiveNumberField extends FASTNumberField {
    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
