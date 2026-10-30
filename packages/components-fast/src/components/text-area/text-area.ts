import { attr, nullableNumberConverter } from "@microsoft/fast-element";
import { TextAreaController, type TextAreaElement, TextAreaResize } from "@adaptive-web/components-foundation";
import { BaseTextInput } from "../text-field/base-text-input.js";

/**
 * A text area. Implements {@link @adaptive-web/components-foundation#TextAreaElement}.
 *
 * @public
 */
export class TextArea extends BaseTextInput<TextAreaController> implements TextAreaElement {
    protected createController(internals: ElementInternals): TextAreaController {
        return new TextAreaController(this, internals);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextAreaElement.rows}
     */
    @attr({ converter: nullableNumberConverter })
    public rows: number | null = null;
    protected rowsChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextAreaElement.cols}
     */
    @attr({ converter: nullableNumberConverter })
    public cols: number | null = null;
    protected colsChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextAreaElement.resize}
     */
    @attr
    public resize: TextAreaResize = TextAreaResize.none;
}
