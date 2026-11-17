/* eslint-disable */
// This file is generated from src/text-area/text-area.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { TextInputContract } from "../text-input/text-input.generated.js";

/**
 * Part names of Text Area for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const TextAreaParts = {
    /** The `label` slot or `label` attribute text in a `<label for>` that names the control. */
    label: "label",

    /** The native `<textarea>`; receives DOM focus and shows the text cursor. */
    control: "control",
} as const;

/**
 * Slot names of Text Area.
 *
 * @public
 */
export const TextAreaSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",
} as const;

/**
 * How the user can resize it. The template's styles do it. The default is `none`.
 *
 * @public
 */
export const TextAreaResize = {
    /** The user can't resize it. */
    none: "none",

    /** The user can resize it in both directions. */
    both: "both",

    /** The user can resize its width. */
    horizontal: "horizontal",

    /** The user can resize its height. */
    vertical: "vertical",
} as const;

/** @public */
export type TextAreaResize = (typeof TextAreaResize)[keyof typeof TextAreaResize];

/**
 * A **Text Area** is a field of several lines that the user types text in. It is a text input around a native `<textarea>`, which receives the focus and handles editing, validation, and autofill. Enter starts a line; it doesn't submit the form.
 *
 * @public
 */
export interface TextAreaContract extends TextInputContract {
    /**
     * The lines it shows.
     */
    rows: number | null;

    /**
     * The characters of a line it shows.
     */
    cols: number | null;

    /**
     * How the user can resize it. The template's styles do it. The default is `none`.
     */
    resize: TextAreaResize;
}
