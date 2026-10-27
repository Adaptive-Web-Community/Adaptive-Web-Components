import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { type AnchorElement, AriaForwardingController, isIconOnly } from "@adaptive-web/components-foundation";

/**
 * A link. Implements {@link @adaptive-web/components-foundation#AnchorElement}.
 *
 * @remarks
 * Has the `icon-only` custom state when its content is one SVG element and no text.
 *
 * @public
 */
export class Anchor extends FASTElement implements AnchorElement {
    private readonly internals = this.attachInternals();
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
     * The content of the default slot.
     *
     * @internal
     */
    @observable
    public defaultSlottedContent: Node[] = [];
    protected defaultSlottedContentChanged(): void {
        if (isIconOnly(this.defaultSlottedContent)) {
            this.internals.states.add("icon-only");
        } else {
            this.internals.states.delete("icon-only");
        }
    }

    /**
     * Focuses the native link.
     */
    public focus(options?: FocusOptions): void {
        this.control?.focus(options);
    }

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
