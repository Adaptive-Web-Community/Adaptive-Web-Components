import { Library } from "design-token-library";
import { InteractiveState } from "./interactive.js";
import { getFormerNames } from "./token-metadata.js";
import { AdaptiveDesignToken } from "./token-types.js";

/**
 * A token that a name finds.
 *
 * @public
 */
export interface ResolvedTokenName {
    /**
     * The path of the token in the library, for a ref.
     */
    readonly path: readonly string[];

    /**
     * The current name of what the name was for: the name of the token, and the state after it for a state of an interactive token, like
     * `color.neutral.fill.subtle.rest`. A tool that stored the name stores this one instead.
     */
    readonly name: string;

    /**
     * The state of an interactive token that the name was for, if any.
     */
    readonly state?: InteractiveState;

    /**
     * Whether the name isn't the current one: a name the token had, or a name in a format of an earlier version.
     */
    readonly renamed: boolean;

    /**
     * The `$deprecated` of the token: `false`, `true`, or why it is deprecated.
     */
    readonly deprecated: boolean | string;
}

/**
 * A token in a {@link TokenNameIndex}.
 *
 * @public
 */
export interface IndexedToken {
    /** The path of the token in the library. */
    readonly path: readonly string[];
    /** Its current name, the path without a `$root`. */
    readonly name: string;
    /** Whether it is an interactive token, which a name of a state finds. */
    readonly interactive: boolean;
    /** Its `$deprecated`. */
    readonly deprecated: boolean | string;
}

/**
 * The names that find the tokens of a library, made by {@link tokenNames}.
 *
 * @public
 */
export interface TokenNameIndex {
    /**
     * Each name that finds a token, with the name of the token and whether the name is a current one.
     */
    readonly names: ReadonlyMap<string, { readonly token: string; readonly current: boolean }>;

    /**
     * The former names of the groups, with the current path of each, the longest first.
     */
    readonly groups: ReadonlyMap<string, string>;

    /**
     * The tokens by their name.
     */
    readonly tokens: ReadonlyMap<string, IndexedToken>;
}

/**
 * Gets the kebab case of a path, as the tokens of 0.x were named: each word and each number apart, like `layer-fill-fixed-minus-1`.
 *
 * @internal
 */
export function kebabName(path: readonly string[]): string {
    return path
        .filter(key => key !== "$root")
        .map(key =>
            key
                .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
                .toLowerCase()
        )
        .join("-");
}

const isNode = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/**
 * Indexes the names that find the tokens of a library: the name of each token, the names it and its groups had before (see
 * {@link formerNames}), and each of them in kebab case.
 *
 * @remarks
 * A name in kebab case is how the tokens of 0.x were named, from the path of the token with or without its first group
 * (`neutral-fill-subtle`, `layer-fill-fixed-minus-1`), and the former name of a group is found in kebab case as well. A name or a former name that is
 * given for two tokens is an error. A kebab case that two tokens have doesn't find either.
 *
 * Why the names are kept with what they name: `docs/decisions/0014-a-names-history-is-kept-with-what-it-names.md`.
 *
 * @param library - The library of the tokens
 * @returns The index, for {@link resolveTokenName}
 * @throws An error for a name that is given for two tokens or two groups
 *
 * @public
 */
export function tokenNames(library: Library.Library<any>): TokenNameIndex {
    const tokens = new Map<string, IndexedToken>();
    const names = new Map<string, { token: string; current: boolean }>();
    const derived = new Map<string, string | null>();
    const groups = new Map<string, string>();

    const add = (name: string, token: string, current: boolean) => {
        const existing = names.get(name);
        if (existing && existing.token !== token) {
            throw new Error(`The name "${name}" is of both ${existing.token} and ${token}`);
        }
        names.set(name, { token, current: current || existing?.current === true });
    };
    const derive = (name: string, token: string) => {
        if (derived.has(name) && derived.get(name) !== token) {
            derived.set(name, null);
        } else {
            derived.set(name, token);
        }
    };
    const deriveAll = (path: readonly string[], token: string) => {
        derive(kebabName(path), token);
        if (path.length > 1) {
            derive(kebabName(path.slice(1)), token);
        }
    };

    const walk = (node: Record<string, unknown>, path: string[]) => {
        for (const [key, child] of Object.entries(node)) {
            if ((key.startsWith("$") && key !== "$root") || !isNode(child)) {
                continue;
            }
            const childPath = [...path, key];
            if ("$value" in child) {
                const name = childPath.join(".");
                const deprecated = child.$deprecated;
                tokens.set(name, {
                    path: childPath,
                    name: (key === "$root" ? path : childPath).join("."),
                    interactive: child.$type === AdaptiveDesignToken.interactive,
                    deprecated: typeof deprecated === "string" || typeof deprecated === "boolean" ? deprecated : false,
                });
                add(name, name, true);
                if (key === "$root") {
                    add(path.join("."), name, true);
                }
                deriveAll(childPath, name);
                for (const former of getFormerNames(child as { $extensions?: Record<string, unknown> })) {
                    add(former, name, false);
                    deriveAll(former.split("."), name);
                }
            } else {
                for (const former of getFormerNames(child as { $extensions?: Record<string, unknown> })) {
                    for (const form of new Set([former, kebabName(former.split("."))])) {
                        const existing = groups.get(form);
                        if (existing !== undefined && existing !== childPath.join(".")) {
                            throw new Error(`The former name "${form}" is of both ${existing} and ${childPath.join(".")}`);
                        }
                        groups.set(form, childPath.join("."));
                    }
                }
                walk(child, childPath);
            }
        }
    };
    walk(library.tokens, []);

    for (const [name, token] of derived) {
        if (token !== null && !names.has(name)) {
            names.set(name, { token, current: false });
        }
    }

    const longestFirst = new Map([...groups].sort(([a], [b]) => b.length - a.length));
    return { names, groups: longestFirst, tokens };
}

const states: ReadonlySet<string> = new Set(Object.values(InteractiveState));
const suffix = /^(.+)([.-])([a-z]+)$/;

// Finds a token by a name, then by a name that ends in a state or in `value`, then by the former name of a group, which may need the
// same again for the rest of the name. Each step makes the name shorter or current, and the depth is a guard all the same.
function resolve(index: TokenNameIndex, name: string, depth: number): ResolvedTokenName | undefined {
    if (depth > 4) {
        return undefined;
    }

    const entry = index.names.get(name);
    if (entry) {
        const token = index.tokens.get(entry.token)!;
        return { path: token.path, name: token.name, renamed: !entry.current, deprecated: token.deprecated };
    }

    const [, base, separator, last] = suffix.exec(name) ?? [];
    if (base !== undefined && (states.has(last) || last === "value")) {
        const found = resolve(index, base, depth + 1);
        if (found && found.state === undefined) {
            // `value` is how 0.14 named the token of a set.
            if (last === "value") {
                return { ...found, renamed: true };
            }
            if (index.tokens.get(found.path.join("."))?.interactive) {
                const state = last as InteractiveState;
                return { ...found, state, name: `${found.name}.${state}`, renamed: found.renamed || separator !== "." };
            }
        }
    }

    for (const [former, group] of index.groups) {
        for (const separator of [".", "-"]) {
            if (name.startsWith(former + separator)) {
                const rest = name.slice(former.length + 1);
                const candidate = separator === "." ? `${group}.${rest}` : `${kebabName(group.split("."))}-${rest}`;
                const found = resolve(index, candidate, depth + 1);
                if (found) {
                    return { ...found, renamed: true };
                }
            }
        }
    }

    return undefined;
}

/**
 * Finds the token that a name is for, the current name of the token or a name it had, and tells if the name was renamed.
 *
 * @remarks
 * A name is found as the name of a token, a former name of the token, or a name under a former name of a group, each also in
 * kebab case (see {@link tokenNames}). A name that ends in a state, `.rest` or `-rest`, is that state of an interactive token, and one
 * that ends in `.value` is the token itself, as 0.14 named the token of a set. A tool that stored the name stores `name` of the result
 * when `renamed` is true, and reports `deprecated`.
 *
 * @param index - The names of the tokens of a library, see {@link tokenNames}
 * @param name - The name, as it was stored
 * @returns The token, or nothing for a name that finds no token
 *
 * @public
 */
export function resolveTokenName(index: TokenNameIndex, name: string): ResolvedTokenName | undefined {
    return resolve(index, name, 0);
}
