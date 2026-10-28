/**
 * The names and signatures of what Adaptive UI had for styles before, for the beta of 1.0 to be an easier step from 0.14.
 *
 * @remarks
 * Everything here is deprecated and will be removed before 1.0, see MIGRATION.md. Why: `docs/decisions/0002-deprecated-names-for-the-beta.md`.
 */
import type { SelectorParameters } from "./css/selector.js";
import type { StyleProperties } from "./properties.js";
import type { StyleRuleTarget } from "./rule.js";
import type { Treatment } from "./treatment.js";

/**
 * @deprecated Use {@link StyleRuleTarget}.
 * @public
 */
export type StyleModuleTarget = StyleRuleTarget;

/**
 * @deprecated Use {@link SelectorParameters}.
 * @public
 */
export type StyleModuleEvaluateParameters = SelectorParameters;

/**
 * @deprecated Use {@link Treatment}, an object.
 * @public
 */
export type Styles = Treatment;

/**
 * @deprecated Write a {@link Treatment} as an object: `{ name, properties }`, or `{ name, treatments, properties }`.
 * @public
 */
export const Styles = {
    /**
     * @deprecated Use `{ name, properties }`.
     */
    fromProperties: (properties: StyleProperties, name?: string): Treatment => ({ name, properties }),

    /**
     * @deprecated Use `{ name, treatments, properties }`.
     */
    compose: (treatments: readonly Treatment[], properties?: StyleProperties, name?: string): Treatment => ({ name, treatments, properties }),
};
