/**
 * Structured gap or defect tracked for conformance, planning, or release notes.
 *
 * @public
 */
export interface KnownIssue {
    /**
     * Stable id for changelog and lint references.
     */
    readonly id: string;

    /**
     * Short description of the issue (Markdown).
     */
    readonly summary: string;

    /**
     * Free-form grouping (for example `accessibility`, `visual`, `behavior`).
     */
    readonly category?: string;

    /**
     * Mitigation product teams can apply today (Markdown).
     */
    readonly workaround?: string;

    /**
     * Planned resolution or tracking note (Markdown).
     */
    readonly plannedFix?: string;

    /**
     * Links to tickets, specs, or discussions.
     */
    readonly sources?: readonly string[];
}

/**
 * Tracked known issues for a documentation record.
 *
 * @public
 */
export type KnownIssues<TIssue extends KnownIssue = KnownIssue> = readonly TIssue[];

/**
 * Known issues section of a documentation record.
 *
 * @public
 */
export type KnownIssuesSection<TKnownIssues extends KnownIssues = KnownIssues> = {
    readonly knownIssues?: TKnownIssues;
};
