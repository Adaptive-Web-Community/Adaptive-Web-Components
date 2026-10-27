import { attr } from "@microsoft/fast-element";
import { SearchController, type SearchElement } from "@adaptive-web/components-foundation";
import { BaseTextInput } from "../text-field/base-text-input.js";

/**
 * A search field. Implements {@link @adaptive-web/components-foundation#SearchElement}.
 *
 * @public
 */
export class Search extends BaseTextInput<SearchController> implements SearchElement {
    protected createController(internals: ElementInternals): SearchController {
        return new SearchController(this, internals);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SearchElement.pattern}
     */
    @attr
    public pattern: string | null = null;
    protected patternChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#SearchElement.clear}
     */
    public clear(): void {
        this.controller.clear();
    }
}
