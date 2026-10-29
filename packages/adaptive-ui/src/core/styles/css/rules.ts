import { CSSPropertiesOptions, isRef, Library, pathOf } from "design-token-library";
import { InteractiveState, isInteractiveSet } from "../../interactive.js";
import { atName, formatValue, propertyResolver } from "../../token-css.js";
import { AdaptiveDesignToken } from "../../token-types.js";
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
 * Gets the custom properties of the token at a path.
 *
 * @public
 */
export type TokenPropertiesResolver = (path: readonly string[]) => TokenProperties;

/**
 * Gets the custom properties of the tokens of a library, named as the library names them when it writes CSS.
 *
 * @param library - The library of the tokens that the styles refer to
 * @param options - The options given to the library to write CSS, if it names a custom property its own way
 * @returns A function that gets the custom properties of the token at a path
 *
 * @public
 */
export function libraryTokenProperties(library: Library.Library<any>, options?: CSSPropertiesOptions): TokenPropertiesResolver {
    const property = propertyResolver(library, options);
    return path => {
        const name = path.join(".");
        const token = atName<{ $type: string; $value: unknown }>(library.tokens, name);
        if (token.$type !== AdaptiveDesignToken.interactive || !isInteractiveSet(token.$value)) {
            return { property: property(name) };
        }
        const set = token.$value;
        return { property: property(name), states: ruleStates.filter(state => set[state] !== undefined && set[state] !== null) };
    };
}

// The order of the rules of the states, as the FAST renderer had it.
const ruleStates: readonly InteractiveState[] = [
    InteractiveState.rest,
    InteractiveState.focus,
    InteractiveState.hover,
    InteractiveState.active,
    InteractiveState.disabled,
];

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
    if (isRef(value)) {
        const properties = tokens(pathOf(value));
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
 * rule, where the later state wins. A foreground fill also sets `fill` to `currentcolor` at rest, for icons.
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
    for (const [key, value] of properties) {
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
