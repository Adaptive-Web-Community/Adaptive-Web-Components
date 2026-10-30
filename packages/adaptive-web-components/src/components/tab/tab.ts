import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { selectTab, tabAria, type TabElement, type TabPanelElement } from "@adaptive-web/components-foundation";

/**
 * A tab of a {@link Tablist}. Implements {@link @adaptive-web/components-foundation#TabElement}.
 *
 * @public
 */
export class Tab extends FASTElement implements TabElement {
    // Before the properties, whose change handlers use it while the element is constructed.
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TabElement.selected}
     */
    @attr({ mode: "boolean" })
    public selected: boolean = false;
    protected selectedChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TabElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;
    protected disabledChanged(): void {
        this.updateAria();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TabElement.panel}
     */
    @observable
    public panel: TabPanelElement | null = null;
    protected panelChanged(): void {
        this.updateAria();
    }

    /**
     * @internal
     */
    public handleClick(): void {
        selectTab(this);
    }

    private updateAria(): void {
        Object.assign(this.internals, tabAria(this));
    }
}
