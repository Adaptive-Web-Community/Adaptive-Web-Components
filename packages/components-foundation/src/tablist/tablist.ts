import type { Orientation } from "../utilities/orientation.js";

/**
 * A tablist (`role="tablist"`): tabs, of which one is selected, and the tab panels they show, which are elsewhere: together, in one
 * container, in the order of the tabs. Implements the {@link https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ | ARIA tabs pattern}, with the
 * tab selected when the focus moves to it, with {@link TablistController}.
 *
 * @remarks
 * The host is the tablist, and has only the tabs, so the strip of tabs and the panels are laid out apart. Each tab shows the panel in the
 * same place among the panels of {@link TablistElement.panelsElement}.
 *
 * Slots: the default slot for the tabs.
 *
 * Events: the `change` of a tab bubbles through it.
 *
 * @public
 */
export interface TablistElement extends HTMLElement {
    /**
     * The direction in which the tabs are laid out, and the arrow keys that move between them.
     *
     * @remarks
     * HTML attribute: `orientation`. The default is `horizontal`.
     */
    orientation: Orientation;

    /**
     * The element whose tab panels the tabs show, in their order: the panels among its children.
     *
     * @remarks
     * HTML attribute: `panels`, the element's id, found where the tablist is. Setting the property to an element sets it directly.
     */
    panelsElement: Element | null;
}
