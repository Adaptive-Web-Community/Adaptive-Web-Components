import type { TextInputElement } from "../text-input/text-input.js";
import type { ValuesOf } from "../utilities/typings.js";

/**
 * The kinds of text a {@link TextFieldElement} takes, as the native input's types.
 *
 * @public
 */
export const TextFieldType = {
    text: "text",
    email: "email",
    password: "password",
    tel: "tel",
    url: "url",
} as const;

/**
 * The kinds of text a {@link TextFieldElement} takes.
 *
 * @public
 */
export type TextFieldType = ValuesOf<typeof TextFieldType>;

/**
 * The parts of a {@link TextFieldElement}.
 *
 * @public
 */
export const TextFieldParts = {
    /** The label, the content of the default slot. */
    label: "label",

    /** The box around the control and the `start` and `end` slots. */
    root: "root",

    /** The native `<input>`. */
    control: "control",
} as const;

/**
 * A text field: a {@link TextInputElement} of one line, around a native `<input>`.
 *
 * @remarks
 * Slots: the default slot for the label, and `start` and `end` around the control.
 *
 * @public
 */
export interface TextFieldElement extends TextInputElement {
    /**
     * The kind of text.
     *
     * @remarks
     * HTML attribute: `type`. The default is `text`.
     */
    type: TextFieldType;

    /**
     * A regular expression that a valid value matches.
     *
     * @remarks
     * HTML attribute: `pattern`.
     */
    pattern: string | null;
}
