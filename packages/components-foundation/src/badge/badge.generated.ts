/* eslint-disable */
// This file is generated from src/badge/badge.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Badge for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const BadgeParts = {
    /** The default slot label between optional `start` and `end` slots. */
    content: "content",
} as const;

/**
 * Slot names of Badge.
 *
 * @public
 */
export const BadgeSlots = {
    /** The badge text or icon. */
    default: "",

    /** Optional content before the label. */
    start: "start",

    /** Optional content after the label. */
    end: "end",
} as const;

/**
 * A **Badge** is a short label, such as a count or status, with optional `start` and `end` content.
 *
 * @public
 */
export interface BadgeContract {
}
