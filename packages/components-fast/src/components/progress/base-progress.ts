import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";
import { progressAria, type ProgressElement } from "@adaptive-web/components-foundation";
import { numberConverter } from "../../utilities/converters.js";

/**
 * The base of {@link Progress} and {@link ProgressRing}. Implements {@link @adaptive-web/components-foundation#ProgressElement}.
 *
 * @public
 */
export class BaseProgress extends FASTElement implements ProgressElement {
    private readonly internals = this.attachInternals();

    // The range is before the value, so the value's default ARIA is made with the range. Each is called with the default while the element is
    // constructed, so the default ARIA is there from the start.

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ProgressElement.min}
     */
    @attr({ mode: "fromView", converter: numberConverter(0) })
    public min: number = 0;
    protected minChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ProgressElement.max}
     */
    @attr({ mode: "fromView", converter: numberConverter(100) })
    public max: number = 100;
    protected maxChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ProgressElement.value}
     */
    @attr({ converter: nullableNumberConverter })
    public value: number | null = null;
    protected valueChanged(): void {
        this.updateAria();
    }

    private updateAria(): void {
        Object.assign(this.internals, progressAria(this));
    }
}
