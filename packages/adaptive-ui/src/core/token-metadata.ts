import { StyleProperty } from "./modules/types.js";

/**
 * The key of Adaptive UI in the `$extensions` of a token.
 *
 * @public
 */
export const extensionKey = "adaptive-ui";

/**
 * Creates the `$extensions` of a token that is intended for use with some style properties.
 *
 * @remarks
 * Tools like the designer use this to tell which tokens apply to a style property.
 *
 * @param properties - The style properties where the token is intended to be used.
 * @returns The `$extensions` for the token
 *
 * @public
 */
export function intendedFor(...properties: StyleProperty[]): Record<string, unknown> {
    return { [extensionKey]: { intendedFor: properties } };
}

/**
 * Gets the style properties where a token is intended to be used.
 *
 * @param token - Any token, or anything with `$extensions`
 * @returns The style properties, or an empty list
 *
 * @public
 */
export function getIntendedFor(token: { $extensions: Record<string, any> }): StyleProperty[] {
    return token.$extensions?.[extensionKey]?.intendedFor ?? [];
}
