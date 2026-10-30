import { attr, FASTElement } from "@microsoft/fast-element";
import { DialogClosedBy, DialogController, type DialogElement } from "@adaptive-web/components-foundation";

/**
 * A dialog. Implements {@link @adaptive-web/components-foundation#DialogElement}.
 *
 * @public
 */
export class Dialog extends FASTElement implements DialogElement {
    private readonly internals = this.attachInternals();
    private readonly controller = new DialogController(this, this.internals);

    /**
     * The native `<dialog>`.
     *
     * @internal
     */
    public control?: HTMLDialogElement;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DialogElement.closedBy}
     */
    @attr({ attribute: "closedby" })
    public closedBy: DialogClosedBy = DialogClosedBy.closeRequest;

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DialogElement.open}
     */
    public get open(): boolean {
        return this.controller.open;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DialogElement.returnValue}
     */
    public get returnValue(): string {
        return this.controller.returnValue;
    }
    public set returnValue(value: string) {
        this.controller.returnValue = value;
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DialogElement.show}
     */
    public show(): void {
        this.controller.show();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DialogElement.showModal}
     */
    public showModal(): void {
        this.controller.showModal();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#DialogElement.close}
     */
    public close(returnValue?: string): void {
        this.controller.close(returnValue);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.control) {
            this.controller.connect(this.control);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }
}
