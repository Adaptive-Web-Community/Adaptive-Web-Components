import { attr, FASTElement, Observable, observable, type Subscriber } from "@microsoft/fast-element";
import { findById, Orientation, TablistController, type TablistElement } from "@adaptive-web/components-foundation";
import { onDefined } from "../../utilities/defined.js";
import { TabPanel } from "../tab-panel/tab-panel.js";
import { Tab } from "../tab/tab.js";

/**
 * A tablist of {@link Tab}s, which show the {@link TabPanel}s of another element. Implements
 * {@link @adaptive-web/components-foundation#TablistElement}.
 *
 * @public
 */
export class Tablist extends FASTElement implements TablistElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    private readonly controller = new TablistController(this, this.internals, {
        isPanel: (element): element is TabPanel => element instanceof TabPanel,
        registry: this.$fastController.definition.registry,
    });
    private tabs: Tab[] = [];
    private explicitPanels: Element | null = null;
    private readonly selectedSubscriber: Subscriber = {
        handleChange: (tab: Tab) => this.controller.tabSelectedChanged(tab),
    };

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TablistElement.orientation}
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;
    protected orientationChanged(): void {
        this.controller.orientationChanged();
    }

    /**
     * The id of the element whose tab panels the tabs show.
     *
     * @remarks
     * HTML attribute: `panels`.
     */
    @attr
    public panels: string | null = null;
    protected panelsChanged(): void {
        this.controller.panelsElementChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TablistElement.panelsElement}
     */
    public get panelsElement(): Element | null {
        return this.explicitPanels ?? findById(this, this.panels);
    }
    public set panelsElement(element: Element | null) {
        this.explicitPanels = element;
        this.controller.panelsElementChanged();
    }

    /**
     * The elements in the default slot.
     *
     * @internal
     */
    @observable
    public slottedElements: Element[] = [];
    protected slottedElementsChanged(): void {
        this.updateTabs();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }

    private updateTabs(): void {
        for (const tab of this.tabs) {
            Observable.getNotifier(tab).unsubscribe(this.selectedSubscriber, "selected");
        }

        this.tabs = this.slottedElements.filter((element): element is Tab => element instanceof Tab);

        for (const tab of this.tabs) {
            Observable.getNotifier(tab).subscribe(this.selectedSubscriber, "selected");
        }

        this.controller.setTabs(this.tabs);

        onDefined(this.slottedElements, this.$fastController.definition.registry, () => this.updateTabs());
    }
}
