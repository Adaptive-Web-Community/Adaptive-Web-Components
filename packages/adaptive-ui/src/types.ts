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
 * An interactive element's states.
 *
 * @public
 */
export enum InteractiveState {
    /**
     * The rest state.
     */
    rest = "rest",

    /**
     * The hover state.
     */
    hover = "hover",

    /**
     * The active state.
     */
    active = "active",

    /**
     * The focus state.
     */
    focus = "focus",

    /**
     * The disabled state.
     */
    disabled = "disabled",
}

/**
 * Values for an interactive element's states.
 *
 * @public
 */
export type InteractiveValues<T> = {
    [key in InteractiveState]: T;
}

/**
 * A group of tokens to use for an interactive element's states.
 *
 * @public
 */
export interface InteractiveTokenGroup<T> extends TokenGroup, InteractiveValues<TypedCSSDesignToken<T>> {}
