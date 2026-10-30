import { attr, FASTElement } from "@microsoft/fast-element";
import { findById, TooltipController, type TooltipElement, TooltipPlacement } from "@adaptive-web/components-foundation";
import { numberConverter } from "../../utilities/converters.js";

/**
 * A tooltip. Implements {@link @adaptive-web/components-foundation#TooltipElement}.
 *
 * @public
 */
export class Tooltip extends FASTElement implements TooltipElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    private readonly controller = new TooltipController(this, this.internals);
    private explicitAnchor: Element | null = null;

    /**
     * The id of the anchor.
     *
     * @internal
     */
    @attr
    public anchor: string | null = null;
    protected anchorChanged(): void {
        this.controller.anchorChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TooltipElement.anchorElement}
     */
    public get anchorElement(): Element | null {
        return this.explicitAnchor ?? findById(this, this.anchor);
    }
    public set anchorElement(element: Element | null) {
        this.explicitAnchor = element;
        this.controller.anchorChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TooltipElement.placement}
     */
    @attr
    public placement: TooltipPlacement = TooltipPlacement.above;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TooltipElement.delay}
     */
    @attr({ mode: "fromView", converter: numberConverter(300) })
    public delay: number = 300;

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }
}
