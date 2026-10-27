import { attr } from "@microsoft/fast-element";
import { SwitchController, type SwitchElement } from "@adaptive-web/components-foundation";
import { BaseCheckable } from "../checkbox/base-checkable.js";

/**
 * A switch. Implements {@link @adaptive-web/components-foundation#SwitchElement}.
 *
 * @public
 */
export class Switch extends BaseCheckable<SwitchController> implements SwitchElement {
    protected createController(internals: ElementInternals): SwitchController {
        return new SwitchController(this, internals);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SwitchElement.required}
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;
    protected requiredChanged(): void {
        this.controller.stateChanged();
    }
}
