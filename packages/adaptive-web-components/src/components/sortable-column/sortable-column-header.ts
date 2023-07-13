import { 
    ColumnDefinition
} from "@microsoft/fast-foundation";

import { 
    FASTElement,
    observable,
    Updates,
} from "@microsoft/fast-element";

import { DefaultSortableColumnContext, SortableColumnContext } from "./sortable-column.context.js";

/**
 * 
 * 
 * @public
 */
export class SortableColumnHeader extends FASTElement {

    /**
     * Context
     *
     * @public
     */
    @SortableColumnContext
    sortableColumnContextSource: SortableColumnContext;

    @observable
    sortableColumnContext: SortableColumnContext = new DefaultSortableColumnContext();

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
        console.debug(this.sortableColumnContext?.sortBy);
        Updates.enqueue(() => {
            this.sortableColumnContext = this.sortableColumnContextSource;
        });
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
