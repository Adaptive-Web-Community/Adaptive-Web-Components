import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { Orientation, type SliderLabelElement } from "@adaptive-web/components-foundation";
import { numberConverter } from "../../utilities/converters.js";

/**
 * A label of a {@link Slider}. Implements {@link @adaptive-web/components-foundation#SliderLabelElement}.
 *
 * @remarks
 * Has the `vertical` custom state when its slider is vertical.
 *
 * @public
 */
export class SliderLabel extends FASTElement implements SliderLabelElement {
    // Before the properties, whose change handlers use it while the element is constructed.
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderLabelElement.position}
     */
    @attr({ mode: "fromView", converter: numberConverter(0) })
    public position: number = 0;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderLabelElement.hideMark}
     */
    @attr({ attribute: "hide-mark", mode: "boolean" })
    public hideMark: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderLabelElement.percent}
     */
    @observable
    public percent: number = 0;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SliderLabelElement.orientation}
     */
    @observable
    public orientation: Orientation = Orientation.horizontal;
    protected orientationChanged(): void {
        if (this.orientation === Orientation.vertical) {
            this.internals.states.add("vertical");
        } else {
            this.internals.states.delete("vertical");
        }
    }
}
