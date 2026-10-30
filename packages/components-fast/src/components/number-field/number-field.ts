import { attr, nullableNumberConverter } from "@microsoft/fast-element";
import { NumberFieldController, type NumberFieldElement } from "@adaptive-web/components-foundation";
import { BaseTextInput } from "../text-field/base-text-input.js";

/**
 * A number field. Implements {@link @adaptive-web/components-foundation#NumberFieldElement}.
 *
 * @public
 */
export class NumberField extends BaseTextInput<NumberFieldController> implements NumberFieldElement {
    protected createController(internals: ElementInternals): NumberFieldController {
        return new NumberFieldController(this, internals);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#NumberFieldElement.min}
     */
    @attr({ converter: nullableNumberConverter })
    public min: number | null = null;
    protected minChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#NumberFieldElement.max}
     */
    @attr({ converter: nullableNumberConverter })
    public max: number | null = null;
    protected maxChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#NumberFieldElement.step}
     */
    @attr({ converter: nullableNumberConverter })
    public step: number | null = null;
    protected stepChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#NumberFieldElement.hideStep}
     */
    @attr({ attribute: "hide-step", mode: "boolean" })
    public hideStep: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#NumberFieldElement.stepUp}
     */
    public stepUp(): void {
        this.controller.stepUp();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#NumberFieldElement.stepDown}
     */
    public stepDown(): void {
        this.controller.stepDown();
    }
}
