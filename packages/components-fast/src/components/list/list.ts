import { attr, FASTElement } from "@microsoft/fast-element";
import { listAria, type ListElement, Orientation } from "@adaptive-web/components-foundation";

/**
 * A list of {@link ListItem}s. Implements {@link @adaptive-web/components-foundation#ListElement}.
 *
 * @public
 */
export class List extends FASTElement implements ListElement {
    private readonly internals = this.attachInternals();

    /**
     * {@inheritDoc @adaptive-web/components-foundation#ListElement.orientation}
     */
    @attr
    public orientation: Orientation = Orientation.vertical;

    constructor() {
        super();
        Object.assign(this.internals, listAria());
    }
}
