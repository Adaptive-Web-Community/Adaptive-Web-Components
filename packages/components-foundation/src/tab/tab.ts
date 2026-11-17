import type { TabPanelElement } from "../tab-panel/tab-panel.js";
import type { DefaultAria } from "../utilities/aria.js";
import type { TabContract } from "./tab.generated.js";

/**
 * A tab of a tablist (`role="tab"`), which shows its panel when it is selected. Implements the tab of the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ | ARIA tabs pattern}.
 *
 * @remarks
 * The host is the tab and takes focus itself; its tablist owns its `tabindex`. Clicking it calls {@link selectTab}.
 *
 * Slots: the default slot for its label, between `start` and `end`.
 *
 * Events: `change` when the user selects it.
 *
 * @public
 */
export interface TabElement extends HTMLElement, TabContract {
    /**
     * The panel that it shows, given by its tablist: the panel in the same place among the panels as the tab among the tabs.
     */
    panel: TabPanelElement | null;
}

/**
 * The default ARIA of a tab: the `tab` role, whether it is selected and disabled, and the panel it controls.
 *
 * @public
 */
export function tabAria(tab: TabElement): DefaultAria {
    return {
        role: "tab",
        ariaSelected: tab.selected ? "true" : "false",
        ariaDisabled: tab.disabled ? "true" : null,
        ariaControlsElements: tab.panel ? [tab.panel] : null,
    };
}

/**
 * Selects a tab as the user asked, and emits `change`.
 *
 * @remarks
 * Does nothing when the tab is disabled or already selected. For the click of the tab, and the keys of its tablist.
 *
 * @public
 */
export function selectTab(tab: TabElement): void {
    if (tab.disabled || tab.selected) {
        return;
    }

    tab.selected = true;
    tab.dispatchEvent(new Event("change", { bubbles: true }));
}
