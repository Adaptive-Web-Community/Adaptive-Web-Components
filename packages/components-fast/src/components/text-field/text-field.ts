import { attr } from "@microsoft/fast-element";
import { TextFieldController, type TextFieldElement, TextFieldType } from "@adaptive-web/components-foundation";
import { BaseTextInput } from "./base-text-input.js";

/**
 * A text field. Implements {@link @adaptive-web/components-foundation#TextFieldElement}.
 *
 * @public
 */
export class TextField extends BaseTextInput<TextFieldController> implements TextFieldElement {
    protected createController(internals: ElementInternals): TextFieldController {
        return new TextFieldController(this, internals);
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextFieldElement."type"}
     */
    @attr
    public type: TextFieldType = TextFieldType.text;
    protected typeChanged(): void {
        this.controller.stateChanged();
    }

    /**
     * {@inheritDoc @adaptive-web/components-foundation#TextFieldElement.pattern}
     */
    @attr
    public pattern: string | null = null;
    protected patternChanged(): void {
        this.controller.stateChanged();
    }
}
