import { observable } from "@microsoft/fast-element";
import { RadioController, type RadioElement } from "@adaptive-web/components-foundation";
import { BaseCheckable } from "../checkbox/base-checkable.js";

/**
 * A radio, of a {@link RadioGroup}. Implements {@link @adaptive-web/components-foundation#RadioElement}.
 *
 * @public
 */
export class Radio extends BaseCheckable<RadioController> implements RadioElement {
    protected createController(internals: ElementInternals): RadioController {
        return new RadioController(this, internals);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#RadioElement.groupReadOnly}
     */
    @observable
    public groupReadOnly: boolean = false;
    protected groupReadOnlyChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#RadioElement.groupDisabled}
     */
    @observable
    public groupDisabled: boolean = false;
    protected groupDisabledChanged(): void {
        this.controller.stateChanged();
    }
}
