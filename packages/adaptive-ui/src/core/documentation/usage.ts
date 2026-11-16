/**
 * How strongly a usage rule should be enforced where linters exist.
 *
 * @public
 */
export const RuleSeverity = {
    /** Required; fail lint when violated. */
    must: "must",
    /** Strong recommendation; warn or report only. */
    should: "should",
    /** Optional guidance. */
    may: "may",
} as const;

/** @public */
export type RuleSeverity = (typeof RuleSeverity)[keyof typeof RuleSeverity];

/**
 * Whether the rule encourages, discourages, or cautions about a practice.
 *
 * @public
 */
export const RuleStance = {
    /** Recommended practice (Do). */
    do: "do",
    /** Anti-pattern (Don't). */
    dont: "dont",
    /** Edge case or exception-heavy guidance; often rendered as a callout. */
    caution: "caution",
} as const;

/** @public */
export type RuleStance = (typeof RuleStance)[keyof typeof RuleStance];

/**
 * Tags usage rules for export, lint, and shared rule sets.
 *
 * @public
 */
export type UsageCategory = string;

/**
 * Reference to a shared usage rule set merged via {@link Usage.include}.
 *
 * @public
 */
export interface UsageRuleSetRef {
    /**
     * Id of the {@link UsageRuleSet} to include.
     */
    readonly id: string;
}

/**
 * A named, reusable collection of product usage rules (for example form-control policy).
 *
 * @public
 */
export interface UsageRuleSet {
    /**
     * Stable set id referenced by {@link UsageRuleSetRef}.
     */
    readonly id: string;

    /**
     * Rules contributed by this set; merged before component-specific rules.
     */
    readonly rules: readonly UsageRule[];
}

/**
 * One semantic usage rule for consuming teams (not visual implementation policy).
 *
 * @public
 */
export interface UsageRule {
    /**
     * Stable id; component rules override shared rules on collision when ids match.
     */
    readonly id: string;

    /**
     * Encouragement, discouragement, or caution framing for export.
     */
    readonly stance: RuleStance;

    /**
     * Enforcement level for product linters.
     */
    readonly severity: RuleSeverity;

    /**
     * Rule statement (Markdown).
     */
    readonly text: string;

    /**
     * Rationale (Markdown).
     */
    readonly reason?: string;

    /**
     * Exceptions or edge cases (Markdown); common for `caution` stance.
     */
    readonly exceptions?: string;

    /**
     * Topics for filtering and grouped export (for example `hierarchy`, `content`).
     */
    readonly categories?: readonly UsageCategory[];

    /**
     * Citations (WCAG, ADR, decision record, Slack archive, etc.) as durable URLs.
     */
    readonly sources?: readonly string[];

    /**
     * Originating {@link UsageRuleSet.id} when this rule came from an included set.
     */
    readonly set?: string;
}

/**
 * Product usage slice: optional shared sets plus component-specific rules.
 *
 * @public
 */
export interface Usage {
    /**
     * Shared rule sets to merge; component `rules` override on id collision.
     */
    readonly include?: readonly UsageRuleSetRef[];

    /**
     * Rules specific to this component.
     */
    readonly rules: readonly UsageRule[];
}

/**
 * Product usage rules section of a documentation record.
 *
 * @public
 */
export type UsageSection<TUsage extends Usage = Usage> = {
    readonly usage?: TUsage;
};
