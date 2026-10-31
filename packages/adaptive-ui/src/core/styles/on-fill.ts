import { isRef, Library, pathOf } from "design-token-library";
import { InteractiveSet, InteractiveState, isInteractiveSet } from "../interactive.js";
import { atName, formatValue } from "../token-css.js";
import { refAt } from "../token-ref.js";
import { isGradient, isPaint } from "../color/paint.js";
import { StyleProperty, type StyleValues } from "./properties.js";

/**
 * A value on a fill: a token made in the context of each state of the fill, like the foreground of a button on its background.
 *
 * @remarks
 * A token that is relative to the color context, like a stroke or black or white, is made again with each state of the fill as the
 * context, so it keeps its contrast with the fill as the fill changes with the state. It is how a treatment pairs a foreground with a
 * background: the pairing isn't a token of the library, it is made for the combinations that the treatments have, whatever they are.
 *
 * Without a `fill`, the value is on the background fill of the rule it is in, so a treatment of a foreground follows the fill of the
 * treatment it is composed with. In a rule that has no background fill, it is the token itself, in the color context.
 *
 * Why a pair isn't a token: `docs/decisions/0013-a-value-on-a-fill-is-made-in-the-context-of-the-fill.md`.
 *
 * @public
 */
export interface OnFill {
    /**
     * The token, a ref to a token that is relative to the color context.
     */
    readonly token: Library.Ref<unknown, never>;

    /**
     * The fill, a ref to a color or an interactive token. The background fill of the rule, if it isn't given.
     */
    readonly fill?: Library.Ref<unknown, never>;

    /**
     * The active state has the value of the rest when the rest and the hover have the same value.
     *
     * @remarks
     * It is for black or white, which would flip from one to the other on press where the active fill is just over the line, as the black
     * or white on a fill of 0.14 didn't. A value that moves by its deltas, like a stroke, moves from the rest in the active state as well.
     */
    readonly activeFollowsRest?: boolean;
}

/**
 * A value on a fill that has its fill.
 *
 * @public
 */
export type OnFillWithFill = OnFill & { readonly fill: Library.Ref<unknown, never> };

/**
 * Creates a value on a fill, a token made in the context of each state of the fill.
 *
 * @example
 * ```ts
 * // On the background fill of the rule:
 * foregroundFill: onFill(color.critical.stroke.readable),
 * // On another fill:
 * foregroundFill: onFill(color.critical.stroke.readable, { fill: color.accent.fill.subtle }),
 * ```
 *
 * @param token - The token, a ref to a token that is relative to the color context
 * @param options - The fill, and if the active state follows the rest, see {@link OnFill}
 * @returns The value on a fill
 *
 * @public
 */
export function onFill(token: Library.Ref<unknown, never>, options: Omit<OnFill, "token"> = {}): OnFill {
    return { token, ...options };
}

/**
 * Tests whether a value of a style property is a value on a fill.
 *
 * @public
 */
export function isOnFill(value: unknown): value is OnFill {
    return typeof value === "object" && value !== null && !isRef(value) && isRef(Reflect.get(value, "token"));
}

/**
 * A value on a fill written as data, like in an anatomy written as JSON: the names of its token and its fill, the paths of their refs.
 *
 * @example
 * ```json
 * "foregroundFill": { "token": "color.critical.stroke.readable", "fill": "color.accent.fill.subtle" }
 * ```
 *
 * @beta
 */
export interface SerializableOnFill {
    /**
     * The name of the token, like `color.critical.stroke.readable`.
     */
    readonly token: string;

    /**
     * The name of the fill. The background fill of the rule, if it isn't given.
     */
    readonly fill?: string;

    /**
     * See {@link OnFill.activeFollowsRest}.
     */
    readonly activeFollowsRest?: boolean;
}

/**
 * Writes a value on a fill as data, with the names of its token and its fill.
 *
 * @beta
 */
export function serializeOnFill(value: OnFillWithFill): SerializableOnFill & { readonly fill: string };
/**
 * @beta
 */
export function serializeOnFill(value: OnFill): SerializableOnFill;
export function serializeOnFill(value: OnFill): SerializableOnFill {
    const { token, fill, activeFollowsRest } = value;
    return {
        token: pathOf(token).join("."),
        ...(fill !== undefined && { fill: pathOf(fill).join(".") }),
        ...(activeFollowsRest !== undefined && { activeFollowsRest }),
    };
}

/**
 * Reads a value on a fill written as data, with refs to the tokens it names.
 *
 * @remarks
 * The names aren't checked: a name that isn't a token of the library is an error when the value is made or rendered.
 *
 * @beta
 */
export function deserializeOnFill(value: SerializableOnFill & { readonly fill: string }): OnFillWithFill;
/**
 * @beta
 */
export function deserializeOnFill(value: SerializableOnFill): OnFill;
export function deserializeOnFill(value: SerializableOnFill): OnFill {
    const { token, fill, activeFollowsRest } = value;
    return {
        token: refAt(token.split(".")),
        ...(fill !== undefined && { fill: refAt(fill.split(".")) }),
        ...(activeFollowsRest !== undefined && { activeFollowsRest }),
    };
}

/**
 * Tests whether data is a value on a fill written as data.
 *
 * @beta
 */
export function isSerializableOnFill(value: unknown): value is SerializableOnFill {
    return typeof value === "object" && value !== null && typeof Reflect.get(value, "token") === "string";
}

/**
 * Gives each value on a fill that has no fill the background fill of the same properties, or makes it the token itself where they have no
 * background fill.
 *
 * @param properties - The properties of a rule, with those of its treatments
 * @returns The properties, where each value on a fill has its fill
 * @throws An error for a value on a fill, without a fill, where the background fill is not a ref to a token
 *
 * @public
 */
export function resolveOnFills(properties: Iterable<readonly [string, StyleValues]>): Map<string, StyleValues> {
    const resolved = new Map(properties);
    const background = resolved.get(StyleProperty.backgroundFill);
    for (const [key, value] of resolved) {
        if (!isOnFill(value) || value.fill !== undefined) {
            continue;
        }
        if (background === undefined) {
            resolved.set(key, value.token);
        } else if (isRef(background)) {
            resolved.set(key, { ...value, fill: background });
        } else {
            throw new Error(`The ${key} is on the background fill, which isn't a token`);
        }
    }
    return resolved;
}

/**
 * Gets the values on a fill of some properties, each with its fill.
 *
 * @param properties - The properties of a rule, with those of its treatments
 * @returns The values on a fill
 *
 * @public
 */
export function onFillsOf(properties: Iterable<readonly [string, StyleValues]>): OnFillWithFill[] {
    return Array.from(resolveOnFills(properties).values()).filter(isOnFillWithFill);
}

function isOnFillWithFill(value: unknown): value is OnFillWithFill {
    return isOnFill(value) && value.fill !== undefined;
}

// A library extended for each library and context, whose context is set to the color of each fill before a value on it is read. One
// library made for each color would cost the whole library each time (an extension extends every token, eagerly), and could never be
// released: its tokens stay subscribed to the ones they extend.
const probes = new WeakMap<Library.Library<any>, Map<string, Library.Library<any>>>();

function inContext(library: Library.Library<any>, context: Library.Ref<unknown, never>, color: unknown): Library.Library<any> {
    const contextName = pathOf(context).join(".");
    const byContext = probes.get(library) ?? new Map<string, Library.Library<any>>();
    probes.set(library, byContext);
    let probe = byContext.get(contextName);
    if (probe === undefined) {
        probe = library.extend({});
        byContext.set(contextName, probe);
    }
    atName<{ set(value: unknown): void }>(probe.tokens, contextName).set(color);
    return probe;
}

/**
 * Gets the value on a fill in each state of the fill: the token in the context of the fill in that state, the rest of an interactive token,
 * or its disabled in the disabled state.
 *
 * @remarks
 * The library is extended with the fill as the value of the context token, so the token is made by its own recipe, as it is in a layer.
 * A state that the fill doesn't have, the value doesn't have either.
 *
 * @param library - The library of the tokens
 * @param value - The value on a fill, with its fill
 * @param context - The token of the color context, a ref, like `color.context` of the reference system
 * @returns The value in each state of the fill
 * @throws An error for a state of the fill that is a gradient, which the color context can't be
 *
 * @public
 */
export function valueOnFill(library: Library.Library<any>, value: OnFillWithFill, context: Library.Ref<unknown, never>): InteractiveSet<unknown> {
    const tokenName = pathOf(value.token).join(".");
    const fillName = pathOf(value.fill).join(".");
    const fill: unknown = atName<{ $value: unknown }>(library.tokens, fillName).$value;
    const fills: InteractiveSet<unknown> = isInteractiveSet(fill) ? fill : { rest: fill };

    const result: InteractiveSet<unknown> = {};
    for (const state of Object.values(InteractiveState)) {
        const background = fills[state];
        if (background === undefined || background === null) {
            if (background === null) {
                result[state] = null;
            }
            continue;
        }
        if (isPaint(background) && isGradient(background)) {
            throw new Error(`The ${state} of ${fillName} is a gradient, which can't be the context of ${tokenName}`);
        }
        const made: unknown = atName<{ $value: unknown }>(inContext(library, context, background).tokens, tokenName).$value;
        const inState = isInteractiveSet(made) ? (state === InteractiveState.disabled ? made.disabled : made.rest) : made;
        if (inState !== undefined) {
            result[state] = inState;
        }
    }

    const { rest, hover, active } = result;
    if (value.activeFollowsRest && rest != null && hover != null && active != null && formatValue(rest) === formatValue(hover)) {
        result.active = rest;
    }
    return result;
}
