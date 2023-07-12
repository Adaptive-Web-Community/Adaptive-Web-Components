import { 
    ColumnDefinition
} from "@microsoft/fast-foundation";

import { 
    FASTElement,
    observable
} from "@microsoft/fast-element";

import { SortableColumnContext } from "./sortable-column.context.js";

/**
 * 
 * 
 * @public
 */
export class SortableColumnHeader extends FASTElement {

    @SortableColumnContext
    public sortableColumnContext: SortableColumnContext;

    /**
     * The data-grid columnDefinition for this column
     * 
     * @public
     */
    @observable
    public columnDefinition: ColumnDefinition;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
