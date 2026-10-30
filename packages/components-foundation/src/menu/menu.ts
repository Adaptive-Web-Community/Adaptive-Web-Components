/**
 * A menu (`role="menu"`) of menu items, which the arrow keys move between. Implements the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ | ARIA menu pattern} with {@link MenuController}.
 *
 * @remarks
 * A menu that opens is a popover: the author gives it `popover`, and opens it with a button's `commandfor` (the Invoker Commands API), which
 * makes the button its anchor; a submenu is one already, from its item. When it opens, its first item has the focus; Escape, a click
 * outside, Tab, and activating an item that does something close it, and the focus goes back to what opened it.
 *
 * Slots: the default slot for the items, and dividers between them.
 *
 * @public
 */
export type MenuElement = HTMLElement;
