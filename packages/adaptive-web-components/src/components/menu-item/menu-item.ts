import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    MenuItemController,
    type MenuItemElement,
    type MenuItemStartColumns,
    MenuItemType,
} from "@adaptive-web/components-foundation";

/**
 * An item of a {@link Menu}. Implements {@link @adaptive-web/components-foundation#MenuItemElement}.
 *
 * @remarks
 * Has the `checked`, `disabled`, `expanded`, `active`, `start-columns-1`, and `start-columns-2` custom states.
 *
 * @public
 */
export class MenuItem extends FASTElement implements MenuItemElement {
    // Before the properties, whose change handlers use these while the element is constructed.
    private readonly internals = this.attachInternals();
    private readonly controller = new MenuItemController(this, this.internals);

    /**
     * {@inheritDoc @adaptive-web/components-foundation#MenuItemElement."type"}
     */
    @attr
    public type: MenuItemType = MenuItemType.item;
    protected typeChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#MenuItemElement.checked}
     */
    @attr({ mode: "boolean" })
    public checked: boolean = false;
    protected checkedChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#MenuItemElement.disabled}
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;
    protected disabledChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#MenuItemElement.startColumns}
     */
    @observable
    public startColumns: MenuItemStartColumns = 0;
    protected startColumnsChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#MenuItemElement.submenu}
     */
    @observable
    public submenu: HTMLElement | null = null;
    protected submenuChanged(): void {
        this.controller.submenuChanged();
    }

    /**
     * The elements in the `submenu` slot.
     *
     * @internal
     */
    @observable
    public slottedSubmenu: Element[] = [];
    protected slottedSubmenuChanged(): void {
        const [submenu] = this.slottedSubmenu;
        this.submenu = submenu instanceof HTMLElement ? submenu : null;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.controller.connect();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.controller.disconnect();
    }
}

