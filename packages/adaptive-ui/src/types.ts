import type { DesignTokenType, TypedCSSDesignToken } from "./adaptive-design-tokens.js";
import { StyleProperty } from "./modules/types.js";

/**
 * A group of tokens.
 *
 * @public
 */
export interface TokenGroup {
    /**
     * The name of the token group. Contained tokens should extend this name like `group-name` -\> `group-name-child`.
     */
    name: string;

    /**
     * The default type for any tokens within this group.
     */
    type?: DesignTokenType;

    /**
     * The style properties where tokens within this group are intended to be used.
     */
    intendedFor?: StyleProperty | StyleProperty[]
}

/**
 * A set for an interactive element's states.
 *
 * @public
 */
export interface InteractiveSet<T> {
    /**
     * The value to apply to the rest state.
     */
    rest: T;

    /**
     * The value to apply to the hover state.
     */
    hover: T;

    /**
     * The value to apply to the active state.
     */
    active: T;

    /**
     * The value to apply to the focus state.
     */
    focus: T;

    /**
     * The value to apply to the disabled state.
     */
    disabled: T;
}

/**
 * A group of tokens to use for an interactive element's states.
 *
 * @public
 */
export interface InteractiveTokenGroup<T> extends TokenGroup, InteractiveSet<TypedCSSDesignToken<T>> {}
