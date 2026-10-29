import type { StyleProperties } from "./properties.js";
import type { Treatment } from "./treatment.js";
import type { TreatmentRef } from "./treatment-token.js";

/**
 * Where a rule applies in a component: the context element, a part, and the conditions of each.
 *
 * @public
 */
export interface StyleRuleTarget {
    /**
     * The selector for the context element. Implementation defaults to `:host` if not provided.
     */
    context?: string;

    /**
     * The condition to match on the context element.
     */
    contextCondition?: string;

    /**
     * Normally the state applies to the context element, or if specified, the part. This option forces the state to the
     * apply to the context element, useful for styling the context element state in only a portion of the child elements.
     */
    stateOnContext?: boolean;

    /**
     * The component part name to apply the rule to.
     */
    part?: string;

    /**
     * The condition to match on the part element.
     */
    partCondition?: string;

    /**
     * Informs the style generator to ignore the interactivity configuration of the component.
     *
     * @remarks
     * The `StyleRuleTarget` and `InteractivityDefinition` together make up the evaluation parameters for
     * generating the styles. In some edge case scenarios the default behavior of considering both of these
     * together is not desireable (ex: Menu items which should show focus when disabled). This is an
     * exploration into a way to describe this, but perhaps there's a more extensible pattern.
     *
     * @beta
     */
    ignoreInteractivity?: boolean;
}

/**
 * A rule of the styles of a component: the treatments and the properties that apply to a target. The properties are applied after the
 * treatments.
 *
 * @public
 */
export interface StyleRule {
    /**
     * The target of the rule. The context element if it isn't given.
     */
    readonly target?: StyleRuleTarget;

    /**
     * The treatments of the rule, applied in order: refs to treatment tokens of the library, which the renderer reads, or treatments
     * written in place.
     */
    readonly treatments?: readonly (TreatmentRef | Treatment)[];

    /**
     * The properties of the rule, applied after the treatments.
     */
    readonly properties?: StyleProperties;

    /**
     * @deprecated Use `treatments`. They are applied before `treatments`.
     */
    readonly styles?: Treatment | readonly Treatment[];
}

/**
 * The rules of the styles of a component.
 *
 * @public
 */
export type StyleRules = readonly StyleRule[];
