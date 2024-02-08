import { FASTSearch } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Search. Extends {@link @microsoft/fast-foundation#FASTSearch}.
 *
 * @public
 */
export class Search extends FASTSearch {
    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
