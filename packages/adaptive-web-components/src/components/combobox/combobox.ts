import { FASTCombobox } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Combobox. Extends {@link @microsoft/fast-foundation#FASTCombobox}.
 *
 * @public
 */
export class Combobox extends FASTCombobox {
    public connectedCallback() {
        super.connectedCallback();

        this.onfocus = this.focusinHandler;
    }

    /**
     * Handles `focusin` actions for the component. When the component receives focus,
     * the input control is focused as it is on click.
     *
     * @internal
     */
    public focusinHandler(e: FocusEvent): void {
        if (!this.shouldSkipFocus && e.target === e.currentTarget) {
            this.setSelectedOptions();
            this.focusAndScrollOptionIntoView();
        }

        this.shouldSkipFocus = false;
    }

    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
