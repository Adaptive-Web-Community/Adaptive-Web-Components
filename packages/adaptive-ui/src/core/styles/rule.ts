import type { InteractivityDefinition } from "./anatomy.js";

/**
 * Parameters used to apply style modules to components.
 *
 * @public
 */
export interface StyleModuleTarget {
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
     * The component part name to apply this style module.
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
     * The `StyleModuleTarget` and `InteractivityDefinition` together makeup the evaluation parameters for
     * generating the styles. In some edge case scenarios the default behavior of considering both of these
     * together is not desireable (ex: Menu items which should show focus when disabled). This is an
     * exploration into a way to describe this, but perhaps there's a more extensible pattern.
     *
     * @beta
     */
    ignoreInteractivity?: boolean;
}

/**
 * Parameters used to evaluate style modules for a component.
 *
 * @public
 */
export type StyleModuleEvaluateParameters = StyleModuleTarget & InteractivityDefinition;
