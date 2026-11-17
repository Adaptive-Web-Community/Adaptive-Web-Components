/* eslint-disable */
// This file is generated from src/text-field/text-field.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { TextInputContract } from "../text-input/text-input.generated.js";

/**
 * Part names of Text Field for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const TextFieldParts = {
    /** The `label` slot or `label` attribute text in a `<label for>` that names the input. */
    label: "label",

    /** Chrome around the control and optional `start` and `end` slots. */
    root: "root",

    /** The native `<input>`; receives DOM focus and shows the text cursor. */
    control: "control",
} as const;

/**
 * Slot names of Text Field.
 *
 * @public
 */
export const TextFieldSlots = {
    /** Replaces the `label` attribute when the label needs more than plain text. */
    label: "label",

    /** Optional content before the input, commonly an icon. */
    start: "start",

    /** Optional content after the input, commonly an icon or affordance. */
    end: "end",
} as const;

/**
 * The native input `type` and its validation affordances.
 *
 * @public
 */
export const TextFieldType = {
    /** Plain text. */
    text: "text",

    /** Email address with built-in format validation. */
    email: "email",

    /** Concealed text entry. */
    password: "password",

    /** Telephone number. */
    tel: "tel",

    /** URL with built-in format validation. */
    url: "url",
} as const;

/** @public */
export type TextFieldType = (typeof TextFieldType)[keyof typeof TextFieldType];

/**
 * A **Text Field** is a single-line control for typed text. The host is the form control through `ElementInternals`; a native `<input>` in the shadow root (the `control` part) handles editing, validation, and autofill.
 *
 * @public
 */
export interface TextFieldContract extends TextInputContract {
    /**
     * The native input `type` and its validation affordances.
     */
    type: TextFieldType;

    /**
     * A regular expression that a valid value matches.
     */
    pattern: string | null;
}
