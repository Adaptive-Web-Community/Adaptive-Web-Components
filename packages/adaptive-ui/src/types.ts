import type { CSSDesignToken } from "@microsoft/fast-foundation";

/**
 * A set of values to use for an interactive element's states.
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
 * A set of tokens to use for an interactive element's states.
 *
 * @public
 */
export interface InteractiveTokenSet<T> extends InteractiveSet<CSSDesignToken<T>> {}
