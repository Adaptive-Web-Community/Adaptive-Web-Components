import { attr, observable } from "@microsoft/fast-element";
import { CheckboxController, type CheckboxElement } from "@adaptive-web/components-foundation";
import { BaseCheckable } from "./base-checkable.js";

/**
 * A checkbox. Implements {@link @adaptive-web/components-foundation#CheckboxElement}.
 *
 * @public
 */
export class Checkbox extends BaseCheckable<CheckboxController> implements CheckboxElement {
    protected createController(internals: ElementInternals): CheckboxController {
        return new CheckboxController(this, internals);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckboxElement.indeterminate}
     */
    @observable
    public indeterminate: boolean = false;
    protected indeterminateChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckboxElement.required}
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;
    protected requiredChanged(): void {
        this.controller.stateChanged();
    }
}
