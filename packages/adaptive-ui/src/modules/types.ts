/**
 * Selectors for focus state.
 *
 * @public
 */
export type FocusSelector = "focus" | "focus-visible" | "focus-within";

/**
 * Selectors for interactive component states.
 *
 * @public
 */
export type StateSelector = "hover" | "active" | FocusSelector;

/**
 * Parameters provided when rendering style modules.
 *
 * @remarks This may be split into `host` and `part` needs.
 * @beta
 */
export interface StyleModuleEvaluateParameters {
    hostCondition?: string;
    part?: string;
    partCondition?: string;
    interactivitySelector?: string;
    nonInteractivitySelector?: string;
}
