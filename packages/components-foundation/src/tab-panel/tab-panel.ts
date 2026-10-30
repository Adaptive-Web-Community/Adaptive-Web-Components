import type { TabElement } from "../tab/tab.js";
import type { DefaultAria } from "../utilities/aria.js";

/**
 * A tab panel (`role="tabpanel"`), shown when its tab is selected, and named by it.
 *
 * @remarks
 * The tablist of its tab sets its `hidden` attribute when its tab isn't selected.
 *
 * Slots: the default slot for its content.
 *
 * @public
 */
export interface TabPanelElement extends HTMLElement {
    /**
     * The tab that shows it, given by the tablist: the tab in the same place among the tabs as the panel among the panels.
     */
    tab: TabElement | null;
}

/**
 * The default ARIA of a tab panel: the `tabpanel` role, named by its tab.
 *
 * @public
 */
export function tabPanelAria(panel: TabPanelElement): DefaultAria {
    return {
        role: "tabpanel",
        ariaLabelledByElements: panel.tab ? [panel.tab] : null,
    };
}
