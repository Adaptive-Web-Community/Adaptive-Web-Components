import type { DesignTokenMetadata, DesignTokenType, TypedCSSDesignToken } from "./adaptive-design-tokens.js";
import { StyleProperty } from "./modules/types.js";

/**
 * @public
 */
export type MakePropertyOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

/**
 * @public
 */
export type MakePropertyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * A group of tokens.
 *
 * @public
 */
export interface TokenGroup extends MakePropertyOptional<DesignTokenMetadata, "type"> {
    /**
     * The name of the token group. Contained tokens should extend this name like `groupName` -\> `groupName.child`.
     */
    name: string;

    /**
     * The default type for any tokens within this group.
     */
    type?: DesignTokenType;

    /**
     * The style properties where tokens within this group are intended to be used.
     */
    intendedFor?: StyleProperty[];
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
export interface InteractiveTokenGroup<T> extends MakePropertyRequired<TokenGroup, "type">, InteractiveValues<TypedCSSDesignToken<T>> {}
