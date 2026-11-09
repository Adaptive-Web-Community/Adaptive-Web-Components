import type { ComponentAnatomy, ComponentConditions, ComponentParts } from "../styles/anatomy.js";
import type { StyleRules } from "../styles/rule.js";

/**
 * The style rules of a component and its anatomy, ready to render to CSS.
 *
 * @public
 */
export interface CompileStyleSheet<T extends ComponentConditions = ComponentConditions, K extends ComponentParts = ComponentParts> {
    readonly rules: StyleRules;
    readonly anatomy: ComponentAnatomy<T, K>;
}
