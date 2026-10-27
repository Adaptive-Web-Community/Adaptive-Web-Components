/**
 * The parts of a badge: a short label, such as a count or a status, with `start` and `end` slots around its content.
 *
 * @remarks
 * A badge has no behavior, so its contract is its parts. Slots: the default slot for the content, and `start` and `end` around it.
 *
 * @public
 */
export const BadgeParts = {
    /** The content of the default slot. */
    content: "content",
} as const;
