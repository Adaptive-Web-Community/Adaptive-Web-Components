import { attr, FASTElement } from "@microsoft/fast-element";
import { type AnchorElement, AriaForwardingController } from "@adaptive-web/components-foundation";

/**
 * A link. Implements {@link @adaptive-web/components-foundation#AnchorElement}.
 *
 * @remarks
 * Defined with `delegatesFocus`, so focusing the element focuses its link, and its `tabindex` is the link's: `-1` takes it out of the tab
 * order, as in a toolbar.
 *
 * @public
 */
export class Anchor extends FASTElement implements AnchorElement {
    protected readonly internals = this.attachInternals();
    private readonly ariaForwarding = new AriaForwardingController(this);

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.download}
     */
    @attr
    public download: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.href}
     */
    @attr
    public href: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.hreflang}
     */
    @attr
    public hreflang: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.ping}
     */
    @attr
    public ping: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.referrerPolicy}
     */
    @attr({ attribute: "referrerpolicy" })
    public referrerPolicy: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.rel}
     */
    @attr
    public rel: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.target}
     */
    @attr
    public target: string | null = null;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement."type"}
     */
    @attr
    public type: string | null = null;

    /**
     * The native link.
     *
     * @internal
     */
    public control?: HTMLAnchorElement;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#AnchorElement.hideLabel}
     */
    @attr({ attribute: "hide-label", mode: "boolean" })
    public hideLabel: boolean = false;

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.control) {
            this.ariaForwarding.connect(this.control);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.ariaForwarding.disconnect();
    }
}
