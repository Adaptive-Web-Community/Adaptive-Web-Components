import { FASTElement, observable } from "@microsoft/fast-element";
import { type TabElement, tabPanelAria, type TabPanelElement } from "@adaptive-web/components-foundation";

/**
 * A panel of a {@link Tablist}. Implements {@link @adaptive-web/components-foundation#TabPanelElement}.
 *
 * @public
 */
export class TabPanel extends FASTElement implements TabPanelElement {
    // Before the properties, whose change handlers use it while the element is constructed.
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TabPanelElement.tab}
     */
    @observable
    public tab: TabElement | null = null;
    // Called with the default while the element is constructed, so the default ARIA is there from the start.
    protected tabChanged(): void {
        Object.assign(this.internals, tabPanelAria(this));
    }
}
