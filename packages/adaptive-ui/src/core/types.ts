import type { DesignTokenMetadata, DesignTokenType, TypedCSSDesignToken } from "./adaptive-design-tokens.js";
import { InteractiveState, type InteractiveValues } from "./interactive.js";
import { StyleProperty } from "./modules/types.js";

export { InteractiveState, type InteractiveValues };

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
 * A group of tokens to use for an interactive element's states.
 *
 * @public
 */
export interface InteractiveTokenGroup<T> extends MakePropertyRequired<TokenGroup, "type">, Record<InteractiveState, TypedCSSDesignToken<T>> {}
