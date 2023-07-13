import { observable } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context";

export interface SortableColumnContext {
    sortBy: string;
    sortInverted: boolean;
}

export const SortableColumnContext = Context.create<SortableColumnContext>("SortableColumnContext");

export class DefaultSortableColumnContext implements SortableColumnContext {
    /**
     * The column data key of the column being sorted to
     *
     * @internal
     */
    @observable
    public sortBy: string;

    /**
     * Whether sort is inverted
     *
     * @internal
     */
    @observable
    public sortInverted: boolean;
}