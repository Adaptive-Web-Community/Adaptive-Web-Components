import type { Structure } from "../documentation/structure.js";
import type { BindingConditionSelectors, BindingPartSelectors, PlatformBinding } from "./binding.js";
import type { StyleRules } from "./rule.js";

/**
 * Inputs to the style pipeline: shared structure, platform binding, and optional theme rules.
 *
 * @public
 */
export interface StyleProfile<
    TConditions extends BindingConditionSelectors = BindingConditionSelectors,
    TParts extends BindingPartSelectors = BindingPartSelectors,
> {
    /**
     * Semantic hooks shared across platforms and generators.
     */
    readonly structure: Structure;

    /**
     * Selector and class mapping for one target platform.
     */
    readonly binding: PlatformBinding<TConditions, TParts>;

    /**
     * Theme or reference style rules keyed by semantic targets.
     */
    readonly rules?: StyleRules;
}
