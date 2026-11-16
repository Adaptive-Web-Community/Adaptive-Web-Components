/**
 * Accessibility expectations and notes for builders and conformance tooling.
 *
 * @public
 */
export interface Accessibility {
    /**
     * Overview of accessibility behavior and expectations (Markdown).
     */
    readonly summary?: string;

    /**
     * Responsibilities that remain with consuming product teams (Markdown per item).
     */
    readonly responsibilities?: readonly string[];

    /**
     * Normative or informative criteria this component supports or maps to.
     */
    readonly criteria?: readonly AccessibilityCriterionRef[];
}

/**
 * Reference to an accessibility criterion (for example a WCAG success criterion id).
 *
 * @public
 */
export interface AccessibilityCriterionRef {
    /**
     * Stable criterion identifier (for example `2.4.7`).
     */
    readonly id: string;

    /**
     * How the component relates to the criterion (Markdown).
     */
    readonly description?: string;
}

/**
 * Accessibility section of a documentation record.
 *
 * @public
 */
export type AccessibilitySection<TAccessibility extends Accessibility = Accessibility> = {
    readonly accessibility?: TAccessibility;
};
