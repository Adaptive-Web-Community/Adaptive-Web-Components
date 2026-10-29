import { CSSPropertiesOptions, isRef, Library, pathOf } from "design-token-library";
import { InteractiveSet, InteractiveState, isInteractiveSet } from "../../interactive.js";
import { atName, formatValue, propertyResolver } from "../../token-css.js";
import { AdaptiveDesignToken } from "../../token-types.js";
import { refAt } from "../../token-ref.js";
import { isOnFill, OnFill, OnFillWithFill, resolveOnFills, valueOnFill } from "../on-fill.js";
import { StyleProperty, StyleValue, StyleValues } from "../properties.js";
import { stylePropertyToCssProperty } from "./css.js";
import { makeSelector, SelectorParameters } from "./selector.js";

/**
 * A rule of CSS: a selector, and the value of each of its properties, in order. It is plain data, which {@link formatRules} writes.
 *
 * @public
 */
export interface CssRule {
    readonly selector: string;
    readonly declarations: Readonly<Record<string, string>>;
}

/**
 * The custom properties of a token that a style refers to: the property of the token, and the states of an interactive token, each a
 * property `<property>-<state>`, as the interactive converter writes them.
 *
 * @public
 */
export interface TokenProperties {
    readonly property: string;
    readonly states?: readonly InteractiveState[];
}

/**
 * Gets the custom properties of the token at a path, or of the token at a path on the fill at another, see {@link OnFill}.
 *
 * @public
 */
export type TokenPropertiesResolver = (path: readonly string[], fill?: readonly string[]) => TokenProperties;

/**
 * The options of the custom properties of the tokens of a library.
 *
 * @public
 */
export interface TokenPropertiesOptions extends CSSPropertiesOptions {
    /**
     * The token of the color context, which a value on a fill is made in the context of, like `color.context` of the reference system.
     */
    readonly context?: Library.Ref<unknown, never>;
}

// The order of the rules of the states, as the FAST renderer had it.
const ruleStates: readonly InteractiveState[] = [
    InteractiveState.rest,
    InteractiveState.focus,
    InteractiveState.hover,
    InteractiveState.active,
    InteractiveState.disabled,
];

// The states of a set that have a value, in the order of the rules.
const statesOf = (set: InteractiveSet<unknown>): InteractiveState[] =>
    ruleStates.filter(state => set[state] !== undefined && set[state] !== null);

// The custom property of a token on a fill, `--<token>-on-<fill>`.
const onFillProperty = (property: (name: string) => string, token: string, fill: string): string =>
    `${property(token)}-on-${property(fill).slice(2)}`;

function contextOf(options: TokenPropertiesOptions | undefined): Library.Ref<unknown, never> {
    if (options?.context === undefined) {
        throw new Error("A value on a fill is made in the context of the fill, which needs the token of the color context in the options");
    }
    return options.context;
}

/**
 * Gets the custom properties of the tokens of a library, named as the library names them when it writes CSS.
 *
 * @remarks
 * The custom property of a value on a fill is `--<token>-on-<fill>`, as {@link onFillCSS} writes it, with the states that the value has.
 *
 * @param library - The library of the tokens that the styles refer to
 * @param options - The options given to the library to write CSS, if it names a custom property its own way, and the token of the color
 * context, for the values on a fill
 * @returns A function that gets the custom properties of the token at a path
 *
 * @public
 */
export function libraryTokenProperties(library: Library.Library<any>, options?: TokenPropertiesOptions): TokenPropertiesResolver {
    const property = propertyResolver(library, options);
    return (path, fill) => {
        const name = path.join(".");
        if (fill !== undefined) {
            const value = valueOnFill(library, { token: refAt(path), fill: refAt(fill) }, contextOf(options));
            return { property: onFillProperty(property, name, fill.join(".")), states: statesOf(value) };
        }
        const token = atName<{ $type: string; $value: unknown }>(library.tokens, name);
        if (token.$type !== AdaptiveDesignToken.interactive || !isInteractiveSet(token.$value)) {
            return { property: property(name) };
        }
        return { property: property(name), states: statesOf(token.$value) };
    };
}

/**
 * Writes the custom properties of values on a fill, as the library writes those of its tokens, for the token CSS of each scope, the
 * root and each layer.
 *
 * @remarks
 * A value on a fill isn't a token of the library: it is made for the combinations that the treatments have, so the CSS of the tokens
 * has a custom property only for those that are given. Each is `--<token>-on-<fill>` at rest and `--<token>-on-<fill>-<state>` in the
 * other states that it has. A value that is given more than once is written once.
 *
 * @param library - The library of the tokens, for the scope
 * @param values - The values on a fill, like the ones of the style rules of the components, see {@link styleRulesOnFills}
 * @param options - The token of the color context, and the name of a custom property if the library is given its own way
 * @returns The declarations
 * @throws An error for the same token on the same fill with and without `activeFollowsRest`, which would be the same custom property
 *
 * @public
 */
export function onFillCSS(
    library: Library.Library<any>,
    values: Iterable<OnFillWithFill>,
    options: TokenPropertiesOptions & { readonly context: Library.Ref<unknown, never> }
): string {
    const property = propertyResolver(library, options);
    const written = new Map<string, boolean>();
    let css = "";
    for (const value of values) {
        const base = onFillProperty(property, pathOf(value.token).join("."), pathOf(value.fill).join("."));
        const activeFollowsRest = value.activeFollowsRest === true;
        if (written.has(base)) {
            if (written.get(base) !== activeFollowsRest) {
                throw new Error(`${base} is given both with and without activeFollowsRest`);
            }
            continue;
        }
        written.set(base, activeFollowsRest);
        const set = valueOnFill(library, value, options.context);
        for (const state of statesOf(set)) {
            css += `${state === InteractiveState.rest ? base : `${base}-${state}`}:${formatValue(set[state])};`;
        }
    }
    return css;
}

function isStyleProperty(key: string): key is StyleProperty {
    return key in StyleProperty;
}

// The custom property of a state of a token, `--x` for the rest and `--x-<state>` for the others, or none if the token doesn't have the state.
function stateProperty({ property, states }: TokenProperties, state: InteractiveState): string | undefined {
    if (states === undefined) {
        return property;
    }
    if (!states.includes(state)) {
        return undefined;
    }
    return state === InteractiveState.rest ? property : `${property}-${state}`;
}

// The CSS of a value in a state, where a ref to an interactive token is the value of the token in that state.
function formatRuleValue(value: StyleValue, state: InteractiveState, tokens: TokenPropertiesResolver): string | undefined {
    if (!isRef(value)) {
        return formatValue(value);
    }
    const property = stateProperty(tokens(pathOf(value)), state);
    return property === undefined ? undefined : `var(${property})`;
}

// The CSS of a value for each state that it has.
function valuesByState(value: StyleValues, tokens: TokenPropertiesResolver): Map<InteractiveState, string> {
    const values = new Map<InteractiveState, string>();
    if (isRef(value) || isOnFill(value)) {
        const properties = isRef(value) ? tokens(pathOf(value)) : tokens(pathOf(value.token), pathOf(fillOf(value)));
        for (const state of properties.states ?? [InteractiveState.rest]) {
            values.set(state, `var(${stateProperty(properties, state)})`);
        }
    } else if (isInteractiveSet<StyleValue>(value)) {
        for (const state of ruleStates) {
            const member = value[state];
            const css = member === undefined || member === null ? undefined : formatRuleValue(member, state, tokens);
            if (css !== undefined) {
                values.set(state, css);
            }
        }
    } else {
        values.set(InteractiveState.rest, formatValue(value));
    }
    return values;
}

function fillOf(value: OnFill): Library.Ref<unknown, never> {
    if (value.fill === undefined) {
        throw new Error("A value on a fill has its fill once the properties are resolved");
    }
    return value.fill;
}

// A state other than the rest has a rule only where the element has that state.
function hasState(params: SelectorParameters, state: InteractiveState): boolean {
    switch (state) {
        case InteractiveState.rest:
            return true;
        case InteractiveState.disabled:
            return params.disabled !== undefined;
        default:
            return params.interactive !== undefined;
    }
}

/**
 * Renders the properties of a style as rules of CSS, a rule for each state that a value has and that the target has.
 *
 * @remarks
 * A property of Adaptive UI, like `backgroundFill`, is written as its CSS property, and any other key as it is. The properties are the
 * effective ones, with the shorthands expanded. The declarations of a state are one rule, and the rules are in the order rest, focus, hover,
 * active, disabled, whatever order the properties give their states: the rules of two states can match at once with the same specificity
 * (a pressed element is also hovered), and the later one wins. States that have the same selector, like those of a pseudo-element, are one
 * rule, where the later state wins. A foreground fill also sets `fill` to `currentcolor` at rest, for icons. A value on a fill that doesn't
 * say its fill is on the background fill of the properties, see {@link resolveOnFills}.
 *
 * @param properties - The style properties and their values
 * @param params - The target of the style and the interactivity of the element, which make the selectors
 * @param tokens - Gets the custom properties of a token that a value refers to, see {@link libraryTokenProperties}
 * @returns The rules
 *
 * @public
 */
export function renderRules(
    properties: Iterable<readonly [string, StyleValues]>,
    params: SelectorParameters,
    tokens: TokenPropertiesResolver
): CssRule[] {
    const rules = new Map<InteractiveState, Record<string, string>>();
    for (const [key, value] of resolveOnFills(properties)) {
        const cssProperty = isStyleProperty(key) ? stylePropertyToCssProperty(key) : key;
        for (const [state, css] of valuesByState(value, tokens)) {
            if (!hasState(params, state)) {
                continue;
            }
            const declarations = rules.get(state) ?? {};
            declarations[cssProperty] = css;
            if (state === InteractiveState.rest && key === StyleProperty.foregroundFill) {
                declarations.fill = "currentcolor";
            }
            rules.set(state, declarations);
        }
    }
    // States that have the same selector, like those of a pseudo-element, which can't follow a state, are one rule: the later state wins.
    const bySelector = new Map<string, Record<string, string>>();
    for (const state of ruleStates) {
        const declarations = rules.get(state);
        if (declarations) {
            const selector = makeSelector(params, state);
            bySelector.set(selector, { ...bySelector.get(selector), ...declarations });
        }
    }
    return Array.from(bySelector, ([selector, declarations]) => ({ selector, declarations }));
}

/**
 * Writes rules as CSS, a rule a line.
 *
 * @param rules - The rules
 * @returns The CSS
 *
 * @public
 */
export function formatRules(rules: Iterable<CssRule>): string {
    return Array.from(rules, ({ selector, declarations }) => {
        const body = Object.entries(declarations)
            .map(([property, value]) => `${property}: ${value};`)
            .join(" ");
        return `${selector} { ${body} }`;
    }).join("\n");
}
