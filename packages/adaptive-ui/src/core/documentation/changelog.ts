import type { DocDate } from "./doc-common.js";

/**
 * Well-known changelog {@link DocChangeKind} values for slices this model owns.
 *
 * @public
 */
export const KnownDocChangeKind = {
    /** Usage rules or narrative policy. */
    guidance: "guidance",
    /** Parts, conditions, participation, or semantic focus. */
    structure: "structure",
    /** Built-in capabilities or runtime behavior description. */
    behavior: "behavior",
    /** Platform selector or class mapping. */
    binding: "binding",
    /** Marked for future removal without deleting yet. */
    deprecation: "deprecation",
    /** Removed from the typed doc or contract. */
    removal: "removal",
    /** Identity, governance, or other record-level fields. */
    governance: "governance",
} as const;

/** @public */
export type KnownDocChangeKind = (typeof KnownDocChangeKind)[keyof typeof KnownDocChangeKind];

/**
 * What changed in a documentation update. Known literals cover first-party slices; additional
 * strings name contributor-defined sections.
 *
 * @public
 */
export type DocChangeKind = KnownDocChangeKind | (string & Record<never, never>);

/**
 * One changelog entry for a component documentation (newest first in arrays).
 *
 * @public
 */
export interface ChangelogEntry {
    /**
     * Date of the change.
     */
    readonly date: DocDate;

    /**
     * Person or agent who authored the change.
     */
    readonly author: string;

    /**
     * Short summary of what changed (Markdown).
     */
    readonly summary: string;

    /**
     * Slice or section affected, for filtering history and release notes.
     */
    readonly changeKind: DocChangeKind;
}

/**
 * Documentation changelog entries for a record (newest first in arrays).
 *
 * @public
 */
export type Changelog<TEntry extends ChangelogEntry = ChangelogEntry> = readonly TEntry[];

/**
 * Changelog section of a documentation record.
 *
 * @public
 */
export type ChangelogSection<TChangelog extends Changelog = Changelog> = {
    readonly changelog?: TChangelog;
};
