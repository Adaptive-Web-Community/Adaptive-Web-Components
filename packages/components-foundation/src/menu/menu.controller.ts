import { type MenuItemElement, type MenuItemStartColumns, MenuItemType } from "../menu-item/menu-item.js";
import { RovingFocusController } from "../utilities/roving-focus.controller.js";
import type { MenuElement } from "./menu.js";

/**
 * What a {@link MenuController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type MenuInternals = Pick<ElementInternals, "role">;

/**
 * The options of a {@link MenuController}.
 *
 * @public
 */
export type MenuOptions = {
    /**
     * Whether an element of the menu is a menu item, which a binding knows by its class.
     */
    isItem: (element: Element) => element is MenuItemElement;
};

/**
 * The behavior of a {@link MenuElement}: the `menu` role; Up, Down, Home, and End, which move the focus between its items, disabled ones
 * too (with a {@link RovingFocusController}); one radio checked in each group of radio items next to each other; the columns of its items,
 * so their contents line up; and, as a popover, the focus on its first item when it opens and back on what opened it when it closes, and
 * closing on Tab and on an item that does something, and closing the submenu of an item that the focus leaves.
 *
 * @remarks
 * The element's binding creates it, calls {@link MenuController.connect} and {@link MenuController.disconnect} with the element's lifecycle,
 * and calls {@link MenuController.setElements} and {@link MenuController.itemCheckedChanged} when its framework observes those changes.
 *
 * @public
 */
export class MenuController {
    private elements: readonly Element[] = [];
    private items: readonly MenuItemElement[] = [];
    private readonly rovingFocus: RovingFocusController<MenuItemElement>;
    // What had the focus when the menu opened: its button, or the item of a submenu.
    private opener: HTMLElement | null = null;

    constructor(private readonly host: MenuElement, internals: MenuInternals, private readonly options: MenuOptions) {
        internals.role = "menu";
        // A disabled menu item stays focusable, as the ARIA practices ask, so the user finds it.
        this.rovingFocus = new RovingFocusController<MenuItemElement>(host, { keys: "vertical", homeEnd: true, isDisabled: () => false });
    }

    /**
     * Starts handling the keyboard, clicks, and opening. For when the element is connected.
     */
    public connect(): void {
        const { host } = this;
        this.rovingFocus.connect();
        host.addEventListener("beforetoggle", this.handleBeforetoggle);
        host.addEventListener("toggle", this.handleToggle);
        host.addEventListener("keydown", this.handleKeydown);
        host.addEventListener("click", this.handleClick);
        host.addEventListener("focusin", this.handleFocusin);
    }

    /**
     * Stops handling the keyboard, clicks, and opening. For when the element is disconnected.
     */
    public disconnect(): void {
        const { host } = this;
        this.rovingFocus.disconnect();
        host.removeEventListener("beforetoggle", this.handleBeforetoggle);
        host.removeEventListener("toggle", this.handleToggle);
        host.removeEventListener("keydown", this.handleKeydown);
        host.removeEventListener("click", this.handleClick);
        host.removeEventListener("focusin", this.handleFocusin);
    }

    /**
     * The elements of the menu changed: its items, and the dividers between them.
     */
    public setElements(elements: readonly Element[]): void {
        this.elements = elements;
        this.items = elements.filter(this.options.isItem);
        this.rovingFocus.setItems(this.items);
        this.rovingFocus.setActive(null);

        // A column for the indicators when an item is checkable, and one for `start` content when an item has it.
        const checkable = this.items.some(item => item.type !== MenuItemType.item);
        const start = this.items.some(item => Array.from(item.children).some(child => child.slot === "start"));
        const columns = ((checkable ? 1 : 0) + (start ? 1 : 0)) as MenuItemStartColumns;
        for (const item of this.items) {
            item.startColumns = columns;
        }
    }

    /**
     * An item was checked or unchecked, by the user or by code. A radio item that is checked unchecks the others of its group: the radio
     * items next to it.
     */
    public itemCheckedChanged(item: MenuItemElement): void {
        if (item.type !== MenuItemType.radio || !item.checked) {
            return;
        }
        for (const other of this.group(item)) {
            if (other !== item && other.checked) {
                other.checked = false;
            }
        }
    }

    private group(item: MenuItemElement): MenuItemElement[] {
        const index = this.elements.indexOf(item);
        const isRadio = (element: Element | undefined): element is MenuItemElement =>
            !!element && this.options.isItem(element) && element.type === MenuItemType.radio;
        let start = index;
        while (isRadio(this.elements[start - 1])) {
            start--;
        }
        let end = index;
        while (isRadio(this.elements[end + 1])) {
            end++;
        }
        return this.elements.slice(start, end + 1).filter(isRadio);
    }

    private get open(): boolean {
        return this.host.matches(":popover-open");
    }

    private close(): void {
        if (this.open) {
            this.host.hidePopover();
        }
    }

    // Before the menu opens, what has the focus is kept; before it closes with the focus in it (Escape, an item, Left in a submenu), the
    // focus goes back there, as a popover's doesn't when its focus was moved into it by script.
    private readonly handleBeforetoggle = (event: Event): void => {
        const { activeElement } = this.host.ownerDocument;
        if ((event as ToggleEvent).newState === "open") {
            this.opener = activeElement instanceof HTMLElement && !this.host.contains(activeElement) ? activeElement : null;
        } else if (this.host.contains(activeElement) && this.opener?.isConnected) {
            this.opener.focus();
        }
    };

    // A menu that opens has the focus on its first item.
    private readonly handleToggle = (): void => {
        if (this.open) {
            const first = this.items[0];
            if (first) {
                this.rovingFocus.setActive(first);
                first.focus();
            }
        } else {
            this.rovingFocus.setActive(null);
        }
    };

    // Tab leaves the menu, and closes it, and the menus it is a submenu of, whose keys it bubbles through.
    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Tab") {
            this.close();
        }
    };

    // An item that does something closes the menu, and the menus it is a submenu of, whose clicks it bubbles through. A disabled item's
    // click doesn't get here.
    private readonly handleClick = (event: MouseEvent): void => {
        const item = event.composedPath().find((target): target is MenuItemElement => target instanceof Element && this.options.isItem(target));
        if (item && item.type === MenuItemType.item && !item.submenu && !event.defaultPrevented) {
            this.close();
        }
    };

    // The focus on an item closes the submenus of the others.
    private readonly handleFocusin = (event: FocusEvent): void => {
        const item = this.items.find(item => item === event.target);
        if (!item) {
            return;
        }
        for (const other of this.items) {
            if (other !== item && other.submenu?.matches(":popover-open")) {
                other.submenu.hidePopover();
            }
        }
    };
}
