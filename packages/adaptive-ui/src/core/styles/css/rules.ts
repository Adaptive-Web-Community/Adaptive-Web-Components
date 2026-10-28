import { CSSPropertiesOptions, DesignToken, isRef, Library, pathOf } from "design-token-library";
import type { Paint } from "../../color/paint.js";
import { InteractiveSet, InteractiveState } from "../../interactive.js";
import { atName, formatValue, propertyResolver } from "../../token-css.js";
import { AdaptiveDesignToken } from "../../token-types.js";
import { StyleProperty } from "../properties.js";
import { StyleModuleEvaluateParameters } from "../rule.js";
import { stylePropertyToCssProperty } from "./css.js";
import { makeSelector } from "./selector.js";

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
 * A value of a style property: a value of CSS, a value of a token type, or a ref to a token of a library, which is written as the `var()` of
 * its custom property.
 *
 * @public
 */
export type StyleRuleValue =
    | string
    | number
    | Paint
    | DesignToken.Values.Readonly.Shadow
    | DesignToken.Values.Readonly.Dimension
    | Library.Ref<unknown, never>;

/**
 * A value of a style property, or a value for each state of an interactive element.
 *
 * @remarks
 * A ref to an interactive token is written as a value for each state that the token has.
 *
 * @public
 */
export type StyleRuleValues = StyleRuleValue | InteractiveSet<StyleRuleValue>;

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

const interactiveStates: ReadonlySet<string> = new Set(Object.values(InteractiveState));

// A set of values is an object whose keys are states. A ref, a color, a dimension, or a shadow has other keys.
function isInteractiveSet<T>(value: unknown): value is InteractiveSet<T> {
    if (typeof value !== "object" || value === null || Array.isArray(value) || isRef(value)) {
        return false;
    }
    const keys = Object.keys(value);
    return keys.length > 0 && keys.every(key => interactiveStates.has(key));
}

function isStyleProperty(key: string): key is StyleProperty {
    return key in StyleProperty;
}

function formatRuleValue(value: StyleRuleValue, tokens: TokenPropertiesResolver): string {
    return isRef(value) ? `var(${tokens(pathOf(value)).property})` : formatValue(value);
}

// The CSS of a value for each state that it has.
function valuesByState(value: StyleRuleValues, tokens: TokenPropertiesResolver): Map<InteractiveState, string> {
    const values = new Map<InteractiveState, string>();
    if (isRef(value)) {
        const { property, states } = tokens(pathOf(value));
        if (states === undefined) {
            values.set(InteractiveState.rest, `var(${property})`);
        } else {
            for (const state of states) {
                values.set(state, state === InteractiveState.rest ? `var(${property})` : `var(${property}-${state})`);
            }
        }
    } else if (isInteractiveSet<StyleRuleValue>(value)) {
        for (const state of ruleStates) {
            const member = value[state];
            if (member !== undefined && member !== null) {
                values.set(state, formatRuleValue(member, tokens));
            }
        }
    } else {
        values.set(InteractiveState.rest, formatRuleValue(value, tokens));
    }
    return values;
}

// A state other than the rest has a rule only where the element has that state.
function hasState(params: StyleModuleEvaluateParameters, state: InteractiveState): boolean {
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
 * (a pressed element is also hovered), and the later one wins. A foreground fill also sets `fill` to `currentcolor` at rest, for icons.
 *
 * @param properties - The style properties and their values
 * @param params - The target of the style and the interactivity of the element, which make the selectors
 * @param tokens - Gets the custom properties of a token that a value refers to, see {@link libraryTokenProperties}
 * @returns The rules
 *
 * @public
 */
export function renderRules(
    properties: Iterable<readonly [string, StyleRuleValues]>,
    params: StyleModuleEvaluateParameters,
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
    return ruleStates.flatMap(state => {
        const declarations = rules.get(state);
        return declarations ? [{ selector: makeSelector(params, state), declarations }] : [];
    });
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
