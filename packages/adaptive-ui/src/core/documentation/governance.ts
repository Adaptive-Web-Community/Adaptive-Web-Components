import type { DocDate } from "./doc-common.js";

/**
 * Governance status of a documentation record.
 *
 * @public
 */
export const DocStatus = {
    /** Work in progress, not shown to product consumers. */
    draft: "draft",
    /** Ready for design or engineering review. */
    inReview: "in-review",
    /** Current consumer-facing documentation. */
    published: "published",
    /** Superseded or scheduled for removal; link successors in changelog or disambiguation. */
    deprecated: "deprecated",
} as const;

/** @public */
export type DocStatus = (typeof DocStatus)[keyof typeof DocStatus];

/**
 * Lifecycle and ownership metadata for a component documentation record.
 *
 * @public
 */
export interface Governance {
    /**
     * Editorial and publication state of this record.
     */
    readonly status?: DocStatus;

    /**
     * Team or individual accountable for keeping the documentation current.
     */
    readonly owner?: string;

    /**
     * Date the documentation was last reviewed for accuracy.
     */
    readonly lastReviewed?: DocDate;
}

/**
 * Governance section of a documentation record.
 *
 * @public
 */
export type GovernanceSection<TGovernance extends Governance = Governance> = {
    readonly governance?: TGovernance;
};
