import "../utilities/dom.js";
import { SpacePressController } from "../utilities/space-press.controller.js";
import { type MenuItemElement, MenuItemType } from "./menu-item.js";

/**
 * What a {@link MenuItemController} uses of the element's `ElementInternals`.
 *
 * @public
 */
export type MenuItemInternals = Pick<ElementInternals, "role" | "ariaChecked" | "ariaDisabled" | "ariaHasPopup" | "ariaExpanded" | "states">;

const roles = {
    [MenuItemType.item]: "menuitem",
    [MenuItemType.checkbox]: "menuitemcheckbox",
    [MenuItemType.radio]: "menuitemradio",
};

/**
 * The behavior of a {@link MenuItemElement}: its role and state (checked, disabled, expanded, and its columns, as custom states); clicks,
 * Enter, and Space, which activate it, unless it is disabled; its submenu, opened by activating it, Right, and the pointer, and closed by
 * Left and Escape; and the pointer, which focuses it.
 *
 * @remarks
 * The binding creates it with the element's `ElementInternals`, calls {@link MenuItemController.connect} and
 * {@link MenuItemController.disconnect} with the element's lifecycle, {@link MenuItemController.stateChanged} when `type`, `checked`,
 * `disabled`, or `startColumns` change, and {@link MenuItemController.submenuChanged} when its `submenu` changes.
 *
 * @public
 */
export class MenuItemController {
    private readonly spacePress: SpacePressController;
    private submenu: HTMLElement | null = null;

    constructor(private readonly host: MenuItemElement, private readonly internals: MenuItemInternals) {
        this.spacePress = new SpacePressController(host, internals.states);
    }

    /**
     * Makes the item focusable by code, unless the author set its `tabindex`, and starts handling its events. For when the element is
     * connected.
     */
    public connect(): void {
        const { host } = this;
        if (!host.hasAttribute("tabindex")) {
            host.tabIndex = -1;
        }
        host.addEventListener("click", this.handleDisabledClick, { capture: true });
        host.addEventListener("click", this.handleClick);
        host.addEventListener("keydown", this.handleKeydown);
        host.addEventListener("pointerenter", this.handlePointerenter);
        this.spacePress.connect();
        this.submenuChanged();
        this.stateChanged();
    }

    /**
     * Stops handling the events. For when the element is disconnected.
     */
    public disconnect(): void {
        const { host } = this;
        host.removeEventListener("click", this.handleDisabledClick, { capture: true });
        host.removeEventListener("click", this.handleClick);
        host.removeEventListener("keydown", this.handleKeydown);
        host.removeEventListener("pointerenter", this.handlePointerenter);
        this.submenu?.removeEventListener("toggle", this.handleToggle);
        this.spacePress.disconnect();
    }

    /**
     * The type, checked, disabled, or the columns changed.
     */
    public stateChanged(): void {
        const { host, internals, submenu } = this;
        const checkable = host.type !== MenuItemType.item;
        internals.role = roles[host.type] ?? roles.item;
        internals.ariaChecked = checkable ? `${host.checked}` : null;
        internals.ariaDisabled = host.disabled ? "true" : null;
        internals.ariaHasPopup = submenu ? "menu" : null;
        internals.ariaExpanded = submenu ? `${this.expanded}` : null;
        this.toggleState("checked", checkable && host.checked);
        this.toggleState("disabled", host.disabled);
        this.toggleState("expanded", this.expanded);
        this.toggleState("start-columns-1", host.startColumns === 1);
        this.toggleState("start-columns-2", host.startColumns === 2);
    }

    /**
     * The submenu changed. It is a popover, `auto` when the author gave it none.
     */
    public submenuChanged(): void {
        this.submenu?.removeEventListener("toggle", this.handleToggle);
        this.submenu = this.host.submenu;
        if (this.submenu) {
            if (this.submenu.popover === null) {
                this.submenu.popover = "auto";
            }
            this.submenu.addEventListener("toggle", this.handleToggle);
        }
        this.stateChanged();
    }

    private get expanded(): boolean {
        return this.submenu?.matches(":popover-open") ?? false;
    }

    private toggleState(state: string, on: boolean): void {
        if (on) {
            this.internals.states.add(state);
        } else {
            this.internals.states.delete(state);
        }
    }

    private openSubmenu(): void {
        if (this.submenu && !this.expanded && !this.host.disabled) {
            this.submenu.showPopover({ source: this.host });
        }
    }

    // Whether an event comes from the item itself, not from its submenu, whose events bubble through it.
    private isOwn(event: Event): boolean {
        return !(this.submenu && event.target instanceof Node && this.submenu.contains(event.target));
    }

    // A disabled item can't be activated: its click reaches neither the author nor its menu.
    private readonly handleDisabledClick = (event: MouseEvent): void => {
        if (this.host.disabled && this.isOwn(event)) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    private readonly handleClick = (event: MouseEvent): void => {
        if (event.defaultPrevented || !this.isOwn(event)) {
            return;
        }
        const { host } = this;
        if (this.submenu) {
            this.openSubmenu();
        } else if (host.type === MenuItemType.checkbox) {
            host.checked = !host.checked;
            host.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (host.type === MenuItemType.radio && !host.checked) {
            host.checked = true;
            host.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };

    private readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.defaultPrevented) {
            return;
        }
        if (!this.isOwn(event)) {
            // Left in the submenu closes it, and the focus goes back to the item.
            if (event.key === "ArrowLeft" && this.expanded) {
                event.preventDefault();
                this.submenu?.hidePopover();
            }
            return;
        }
        if (event.target !== this.host) {
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            this.host.click();
        } else if (event.key === "ArrowRight" && this.submenu) {
            event.preventDefault();
            this.openSubmenu();
        }
    };

    // The pointer moves the focus, as the keys do, and opens the submenu.
    private readonly handlePointerenter = (): void => {
        if (this.host.ownerDocument.activeElement !== this.host) {
            this.host.focus();
        }
        this.openSubmenu();
    };

    // The submenu opened or closed; as a menu, it gives the focus back to the item when it closes.
    private readonly handleToggle = (): void => {
        this.stateChanged();
    };
}
