import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { Orientation, ToolbarController, type ToolbarElement } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";

/**
 * A toolbar. Implements {@link @adaptive-web/components-foundation#ToolbarElement}.
 *
 * @public
 */
export class Toolbar extends FASTElement implements ToolbarElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    private readonly controller = new ToolbarController(this, this.internals);

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ToolbarElement.orientation}
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;
    protected orientationChanged(): void {
        this.controller.orientationChanged();
    }

    /**
     * The elements in the `label` slot.
     *
     * @internal
     */
    @observable
    public labelElements: Element[] = [];
    protected labelElementsChanged(): void {
        this.controller.labelsChanged(this.labelElements);
    }

    /**
     * The elements in the `start` slot.
     *
     * @internal
     */
    @observable
    public startElements: Element[] = [];
    protected startElementsChanged(): void {
        this.updateElements();
    }

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateElements();
    }

    /**
     * The elements in the `end` slot.
     *
     * @internal
     */
    @observable
    public endElements: Element[] = [];
    protected endElementsChanged(): void {
        this.updateElements();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
        this.updateElements();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    // The slots change while the element is constructed and connected, before the element has all three.
    private updateElements(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        const elements = [...this.startElements, ...this.slottedElements, ...this.endElements];
        this.controller.setElements(elements);

        // A component that is focusable sets its `tabindex` when it is defined.
        onDefined(elements, this.$fastController.definition.registry, () => this.updateElements());
    }
}
