import type { TypedCSSDesignToken } from "./adaptive-design-tokens.js";

/**
 * A group of tokens.
 *
 * @public
 */
export interface TokenGroup {
    name: string;
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
}

/**
 * A group of tokens to use for an interactive element's states.
 *
 * @public
 */
export interface InteractiveTokenGroup<T> extends TokenGroup, InteractiveSet<TypedCSSDesignToken<T>> {}
