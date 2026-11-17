/* eslint-disable */
// This file is generated from src/button/button.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { ContentLabelledContract } from "../utilities/content-labelled.generated.js";

/**
 * Part names of Button for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const ButtonParts = {
    /** The default slot label and any inline content between optional `start` and `end` slots. */
    content: "content",
} as const;

/**
 * Slot names of Button.
 *
 * @public
 */
export const ButtonSlots = {
    /** The content of the element, which is its label and names it. */
    default: "",

    /** Optional content before the label, commonly an icon. */
    start: "start",

    /** Optional content after the label, commonly an icon. */
    end: "end",
} as const;

/**
 * Form participation: submit, reset, or plain button.
 *
 * @public
 */
export const ButtonType = {
    /** No default form action. */
    button: "button",

    /** Submits the associated form. */
    submit: "submit",

    /** Resets the associated form. */
    reset: "reset",
} as const;

/** @public */
export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];

/**
 * A **Button** triggers an action or submits a form. The host element is the control: it receives focus, participates in forms, and exposes a default slot for its label.
 *
 * @public
 */
export interface ButtonContract extends ContentLabelledContract {
    /**
     * When set, the button cannot be activated and is removed from the tab order.
     */
    disabled: boolean;

    /**
     * Form participation: submit, reset, or plain button.
     */
    type: ButtonType;
}
