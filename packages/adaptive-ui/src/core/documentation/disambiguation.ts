import type { DocRef } from "./doc-ref.js";

/**
 * Points readers to a related component or pattern and when to prefer it.
 *
 * @public
 */
export interface DisambiguationEntry extends DocRef {
    /**
     * Readable label of the related component or pattern, when it isn't the one made from its id (`textArea` is `Text Area`).
     */
    readonly label?: string;

    /**
     * When to use the related option instead of this one (Markdown).
     */
    readonly use: string;
}

/**
 * Related components and when to choose each.
 *
 * @public
 */
export type Disambiguation<TEntry extends DisambiguationEntry = DisambiguationEntry> = readonly TEntry[];

/**
 * Disambiguation section of a documentation record.
 *
 * @public
 */
export type DisambiguationSection<
    TDisambiguation extends Disambiguation = Disambiguation,
> = {
    readonly disambiguation?: TDisambiguation;
};
