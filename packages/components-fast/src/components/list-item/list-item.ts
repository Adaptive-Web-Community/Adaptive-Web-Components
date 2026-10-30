import { FASTElement } from "@microsoft/fast-element";
import { listItemAria, type ListItemElement } from "@adaptive-web/components-foundation";

/**
 * An item of a {@link List}. Implements {@link @adaptive-web/components-foundation#ListItemElement}.
 *
 * @public
 */
export class ListItem extends FASTElement implements ListItemElement {
    private readonly internals = this.attachInternals();

    constructor() {
        super();
        Object.assign(this.internals, listItemAria());
    }
}
