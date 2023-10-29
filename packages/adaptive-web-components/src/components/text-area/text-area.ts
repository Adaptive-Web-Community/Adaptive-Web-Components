import { FASTTextArea } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Text Area. Extends {@link @microsoft/fast-foundation#FASTTextArea}.
 *
 * @public
 */
export class AdaptiveTextArea extends FASTTextArea {
    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
