import { attr } from "@microsoft/fast-element";
import { FASTButton, whitespaceFilter } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Button. Extends {@link @microsoft/fast-foundation#FASTButton}.
 *
 * @public
 */
export class AdaptiveButton extends FASTButton {
    @attr({ attribute: "icon-only", mode: "boolean" })
    public iconOnly: boolean;
    public iconOnlyChanged(prev: boolean, next: boolean): void {
        if (prev !== undefined) {
            console.log("iconOnlyChanged", prev, next);
            this.updateIconOnlyClass();
        }
    }

    private _slottedIconOnly = false;
    private _startIconOnly = 0;
    private _defaultIconOnly = 0;
    private _endIconOnly = 0;

    public connectedCallback(): void {
        super.connectedCallback();
        this.start.addEventListener("slotchange", this.handleSlotChange);
        this.end.addEventListener("slotchange", this.handleSlotChange);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.start.removeEventListener("slotchange", this.handleSlotChange);
        this.end.removeEventListener("slotchange", this.handleSlotChange);
    }

    private checkNodes(nodes: Node[]): number {
        if (nodes.length === 0) {
            return 0;
        } else if (nodes.length === 1 && nodes[0] instanceof SVGElement) {
            return 1;    
        } else {
            return 2;
        }
    }

    private handleSlotChange = (event: Event): void => {
        const target = event.currentTarget as HTMLSlotElement;
        const nodes = target.assignedNodes().filter(whitespaceFilter);
        if (target === this.start) {
            this._startIconOnly = this.checkNodes(nodes);
        } else {
            this._endIconOnly = this.checkNodes(nodes);
        }
        console.log("handleSlotChange", target.name, nodes);
        this.updateSlottedIconOnly();
    }

    protected defaultSlottedContentChanged(): void {
        const nodes = this.defaultSlottedContent.filter(whitespaceFilter);
        console.log("defaultSlottedContentChanged", nodes);
        this._defaultIconOnly = this.checkNodes(nodes);
        this.updateSlottedIconOnly();
    }

    private updateSlottedIconOnly(): void {
        const count = this._startIconOnly + this._defaultIconOnly + this._endIconOnly;
        console.log("count", count);
        
        this._slottedIconOnly = count === 1;
        this.updateIconOnlyClass();
    }

    private updateIconOnlyClass(): void {
        if (this.iconOnly || this._slottedIconOnly) {
            this.control.classList.add("icon-only");
        } else {
            this.control.classList.remove("icon-only");
        }
    }

    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
