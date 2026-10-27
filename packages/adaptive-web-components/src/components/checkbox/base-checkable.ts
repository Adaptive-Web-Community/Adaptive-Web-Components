import { attr, FASTElement, observable } from "@microsoft/fast-element";
import type { CheckableController, CheckableElement } from "@adaptive-web/components-foundation";
import { stringConverter } from "../../utilities/converters.js";

/**
 * The base of {@link Checkbox}, {@link Switch}, and {@link Radio}. Implements
 * {@link @adaptive-web/components-foundation#CheckableElement}, with the controller its component makes.
 *
 * @public
 */
export abstract class BaseCheckable<C extends CheckableController = CheckableController> extends FASTElement implements CheckableElement {
    /**
     * The element is a form control.
     */
    public static readonly formAssociated = true;

    protected readonly internals = this.attachInternals();

    // Made before the properties, whose change handlers use it while the element is constructed.
    protected readonly controller: C = this.createController(this.internals);

    /**
     * Makes the component's controller.
     */
    protected abstract createController(internals: ElementInternals): C;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckableElement.defaultChecked}
     */
    @attr({ attribute: "checked", mode: "boolean" })
    public defaultChecked: boolean = false;
    protected defaultCheckedChanged(): void {
        this.controller.defaultCheckedChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckableElement.checked}
     */
    @observable
    public checked: boolean = false;
    protected checkedChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckableElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckableElement.name}
     */
    @attr
    public name: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckableElement.value}
     */
    @attr({ mode: "fromView", converter: stringConverter("on") })
    public value: string = "on";
    protected valueChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckableElement.form}
     */
    public get form(): HTMLFormElement | null {
        return this.internals.form;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#CheckableElement.labels}
     */
    public get labels(): NodeList {
        return this.internals.labels;
    }

    /**
     * The content of the default slot, the label.
     *
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[] = [];

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    /**
     * @internal
     */
    public formResetCallback(): void {
        this.controller.formReset();
    }
}
