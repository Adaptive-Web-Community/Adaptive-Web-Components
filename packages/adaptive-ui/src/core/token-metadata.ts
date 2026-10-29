import { StyleProperty } from "./styles/properties.js";

/**
 * The key of Adaptive UI in the `$extensions` of a token.
 *
 * @public
 */
export const extensionKey = "adaptive-ui";

/**
 * What Adaptive UI keeps about a token or a group, in its `$extensions`.
 *
 * @public
 */
export interface TokenMetadata {
    /**
     * The style properties where the token is intended to be used, see {@link intendedFor}.
     */
    readonly intendedFor?: readonly StyleProperty[];

    /**
     * The names the token or the group had before, see {@link formerNames}.
     */
    readonly formerNames?: readonly string[];
}

/**
 * Creates the `$extensions` of a token or a group, with what Adaptive UI keeps about it.
 *
 * @param metadata - The style properties it is intended for, and the names it had
 * @returns The `$extensions`
 *
 * @public
 */
export function tokenMetadata(metadata: TokenMetadata): Record<string, unknown> {
    const given = Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== undefined));
    return { [extensionKey]: given };
}

/**
 * Creates the `$extensions` of a token that is intended for use with some style properties.
 *
 * @remarks
 * Tools like the designer use this to tell which tokens apply to a style property. Use it on a token whose type has more than
 * one use, like a color (a fill, a stroke, or a foreground) or a dimension (a corner radius, a padding, or a font size). A
 * token whose type has one use, like a font weight or a shadow, doesn't need it: its type says what it's for. With the names
 * the token had as well, use {@link tokenMetadata}.
 *
 * @param properties - The style properties where the token is intended to be used.
 * @returns The `$extensions` for the token
 *
 * @public
 */
export function intendedFor(...properties: StyleProperty[]): Record<string, unknown> {
    return tokenMetadata({ intendedFor: properties });
}

/**
 * Creates the `$extensions` of a token or a group that was renamed, with the names it had.
 *
 * @remarks
 * A name that was stored, like in a design file or an anatomy written as JSON, still finds the token, and a tool can tell that it
 * was renamed and update what it stored, see {@link resolveTokenName}. On a group, a former name is the old path of the group,
 * and the tokens in it keep their path within it. With the style properties the token is intended for as well, use
 * {@link tokenMetadata}.
 *
 * @param names - The names the token or the group had, from any version
 * @returns The `$extensions`
 *
 * @public
 */
export function formerNames(...names: string[]): Record<string, unknown> {
    return tokenMetadata({ formerNames: names });
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

/**
 * Gets the names a token or a group had before.
 *
 * @param node - A token or a group, or anything with `$extensions`
 * @returns The names, or an empty list
 *
 * @public
 */
export function getFormerNames(node: { $extensions?: Record<string, any> }): string[] {
    return node.$extensions?.[extensionKey]?.formerNames ?? [];
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/**
 * Gives each token of a config the names it had, from its path in the config, like the tokens of a group that a function makes.
 *
 * @remarks
 * For a rename that follows a rule, the rule is a function next to the tokens, and the names are data on each token, as
 * {@link formerNames} gives them. The `$extensions` of each token that has names is replaced, with the names after those it had, so an
 * object it shared with other tokens isn't changed; the config is returned, changed so.
 *
 * @param config - The config of a group, which is new, like what `typeRamp` or `createDensity` returns
 * @param namesOf - The names a token had, from its path in the config, or none
 * @returns The config
 *
 * @public
 */
export function withFormerNames<C extends object>(config: C, namesOf: (path: readonly string[]) => readonly string[]): C {
    const visit = (node: Record<string, unknown>, path: readonly string[]) => {
        for (const [key, child] of Object.entries(node)) {
            // `$root` is a group's own token; the other `$` names are properties of the format.
            if ((key.startsWith("$") && key !== "$root") || !isRecord(child)) {
                continue;
            }
            const childPath = [...path, key];
            if (!("$value" in child)) {
                visit(child, childPath);
                continue;
            }
            const names = namesOf(childPath);
            if (names.length > 0) {
                const extensions = isRecord(child.$extensions) ? child.$extensions : {};
                const own = isRecord(extensions[extensionKey]) ? extensions[extensionKey] : {};
                const previous = Array.isArray(own.formerNames) ? own.formerNames : [];
                child.$extensions = { ...extensions, [extensionKey]: { ...own, formerNames: [...previous, ...names] } };
            }
        }
    };
    if (isRecord(config)) {
        visit(config, []);
    }
    return config;
}
