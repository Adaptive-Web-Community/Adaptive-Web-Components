import type { TabPanelElement } from "../tab-panel/tab-panel.js";
import { selectTab, type TabElement } from "../tab/tab.js";
import { RovingFocusController } from "../utilities/roving-focus.controller.js";
import type { TablistElement } from "./tablist.js";

/**
 * What a {@link TablistController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type TablistInternals = Pick<ElementInternals, "role" | "ariaOrientation">;

/**
 * The options of a {@link TablistController}.
 *
 * @public
 */
export type TablistOptions = {
    /**
     * Whether a child of the panels' element is a tab panel, which a binding knows by its class.
     */
    isPanel: (element: Element) => element is TabPanelElement;

    /**
     * The registry that defines the panels, which is waited for when a child isn't defined yet.
     */
    registry: CustomElementRegistry;
};

/**
 * The behavior of a {@link TablistElement}: the `tablist` role, in its orientation; one tab selected, and its panel shown; each tab given
 * its panel and each panel its tab, in order, as the panels' element's children change; the arrow keys in the orientation, Home, and End,
 * which move the focus between the tabs, disabled ones too, and select the tab they move to (with a {@link RovingFocusController}).
 *
 * @remarks
 * The element's binding creates it, calls {@link TablistController.connect} and {@link TablistController.disconnect} with the element's
 * lifecycle, and calls {@link TablistController.setTabs}, {@link TablistController.tabSelectedChanged},
 * {@link TablistController.orientationChanged}, and {@link TablistController.panelsElementChanged} when its framework observes those
 * changes. The controller observes the children of the panels' element itself, since they aren't the tablist's.
 *
 * @public
 */
export class TablistController {
    private tabs: readonly TabElement[] = [];
    private panels: readonly TabPanelElement[] = [];
    private readonly rovingFocus: RovingFocusController<TabElement>;
    private readonly observer = new MutationObserver(() => this.panelsChanged());
    private connected = false;

    constructor(private readonly host: TablistElement, private readonly internals: TablistInternals, private readonly options: TablistOptions) {
        internals.role = "tablist";
        // Selecting the tab the focus moves to emits its change, as a click does. A disabled tab stays focusable, as the ARIA practices
        // ask, so the user finds it, and isn't selected.
        this.rovingFocus = new RovingFocusController<TabElement>(host, {
            keys: host.orientation,
            homeEnd: true,
            onMove: tab => selectTab(tab),
            isDisabled: () => false,
        });
    }

    /**
     * Starts handling the keyboard, and observing the panels. For when the element is connected.
     */
    public connect(): void {
        this.connected = true;
        this.rovingFocus.connect();
        this.orientationChanged();
        this.panelsElementChanged();
    }

    /**
     * Stops handling the keyboard, and observing the panels. For when the element is disconnected.
     */
    public disconnect(): void {
        this.connected = false;
        this.rovingFocus.disconnect();
        this.observer.disconnect();
    }

    /**
     * The tabs changed. They are paired with the panels in order.
     *
     * @remarks
     * When several tabs are selected, the last stays selected. When none is, or the selected one is disabled, the first that isn't disabled
     * is selected.
     */
    public setTabs(tabs: readonly TabElement[]): void {
        this.tabs = tabs;
        this.rovingFocus.setItems(tabs);
        this.pair();
    }

    /**
     * The panels' element changed, or its id. It is found again, and its children observed. While the document is still being parsed, an
     * element after the tablist isn't there yet, so it is looked for again when the document is parsed.
     */
    public panelsElementChanged(): void {
        this.observer.disconnect();
        if (!this.connected) {
            return;
        }

        const container = this.host.panelsElement;
        if (container) {
            this.observer.observe(container, { childList: true });
        } else if (this.host.ownerDocument.readyState === "loading") {
            this.host.ownerDocument.addEventListener("DOMContentLoaded", () => this.panelsElementChanged(), { once: true });
        }
        this.panelsChanged();
    }

    /**
     * A tab was selected or unselected, by the user or by code. A tab that is selected unselects the others.
     */
    public tabSelectedChanged(tab: TabElement): void {
        if (tab.selected) {
            this.selectOnly(tab);
        } else {
            this.update();
        }
    }

    /**
     * The orientation changed.
     */
    public orientationChanged(): void {
        const { orientation } = this.host;
        this.internals.ariaOrientation = orientation;
        this.rovingFocus.setKeys(orientation);
    }

    // The panels' element's children changed: its panels are found again, and those not defined yet are waited for.
    private panelsChanged(): void {
        const children = Array.from(this.host.panelsElement?.children ?? []);
        const { registry } = this.options;
        for (const child of children) {
            if (child.localName.includes("-") && !registry.get(child.localName)) {
                void registry.whenDefined(child.localName).then(() => this.panelsChanged());
            }
        }
        this.panels = children.filter(this.options.isPanel);
        this.pair();
    }

    private pair(): void {
        const { tabs, panels } = this;
        tabs.forEach((tab, index) => {
            tab.panel = panels[index] ?? null;
        });
        panels.forEach((panel, index) => {
            panel.tab = tabs[index] ?? null;
        });

        const enabled = tabs.filter(tab => !tab.disabled);
        const selected = enabled.filter(tab => tab.selected).pop() ?? enabled[0] ?? null;
        this.selectOnly(selected);
    }

    private selectOnly(selected: TabElement | null): void {
        for (const tab of this.tabs) {
            if (tab !== selected && tab.selected) {
                tab.selected = false;
            }
        }
        if (selected && !selected.selected) {
            selected.selected = true;
        }
        this.update();
    }

    private update(): void {
        for (const panel of this.panels) {
            panel.hidden = !panel.tab?.selected;
        }
        this.rovingFocus.setActive(this.tabs.find(tab => tab.selected) ?? null);
    }
}
