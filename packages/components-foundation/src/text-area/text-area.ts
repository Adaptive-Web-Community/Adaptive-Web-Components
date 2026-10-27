import type { TextInputElement } from "../text-input/text-input.js";
import type { ValuesOf } from "../utilities/typings.js";

/**
 * How the user can resize a {@link TextAreaElement}.
 *
 * @public
 */
export const TextAreaResize = {
    none: "none",
    both: "both",
    horizontal: "horizontal",
    vertical: "vertical",
} as const;

/**
 * How the user can resize a {@link TextAreaElement}.
 *
 * @public
 */
export type TextAreaResize = ValuesOf<typeof TextAreaResize>;

/**
 * The parts of a {@link TextAreaElement}.
 *
 * @public
 */
export const TextAreaParts = {
    /** The label, the content of the default slot. */
    label: "label",

    /** The native `<textarea>`. */
    control: "control",
} as const;

/**
 * A text area: a {@link TextInputElement} of several lines, around a native `<textarea>`. Enter starts a line; it doesn't submit the form.
 *
 * @remarks
 * Slots: the default slot for the label.
 *
 * @public
 */
export interface TextAreaElement extends TextInputElement {
    /**
     * The lines it shows.
     *
     * @remarks
     * HTML attribute: `rows`.
     */
    rows: number | null;

    /**
     * The characters of a line it shows.
     *
     * @remarks
     * HTML attribute: `cols`.
     */
    cols: number | null;

    /**
     * How the user can resize it. The template's styles do it.
     *
     * @remarks
     * HTML attribute: `resize`. The default is `none`.
     */
    resize: TextAreaResize;
}
