import { AdaptiveDesignToken, getIntendedFor, isInteractiveSet, isPaint, StyleProperty, StylePropertyShorthand } from "@adaptive-web/adaptive-ui";
import { configuredValueOf, DesignToken, entriesOf, isComputed, isRef, Library, pathOf } from "design-token-library";
import { type PluginLibrary, tokens } from "./library.js";
import { overridableTypes } from "./values.js";

/**
 * A token that the designer is offered, to apply to a style property or to give a value to.
 */
export interface CatalogToken {
    /**
     * The name of the token, which is how a node stores it: its path, without the `$root` of a group.
     */
    readonly name: string;

    /**
     * The path of the token in the library.
     */
    readonly path: readonly string[];

    /**
     * The `$type` of the token.
     */
    readonly type: string;

    /**
     * The style properties it is applied to, see {@link propertiesOf}.
     */
    readonly appliesTo: readonly StyleProperty[];
}

const P = StyleProperty;
const fills = [P.backgroundFill, P.foregroundFill, ...StylePropertyShorthand.borderFill, P.outlineColor];
const dimensions = [
    ...StylePropertyShorthand.borderThickness,
    ...StylePropertyShorthand.cornerRadius,
    ...StylePropertyShorthand.padding,
    ...StylePropertyShorthand.margin,
    P.gap, P.fontSize, P.letterSpacing, P.lineHeight, P.outlineOffset, P.outlineThickness,
    P.height, P.minHeight, P.maxHeight, P.width, P.minWidth, P.maxWidth,
];

/**
 * The style properties that a token of a `$type` can be applied to, for a token that isn't intended for any (see {@link propertiesOf}).
 *
 * @remarks
 * A `color`, a `paint` and a `gradient` are the same: a paint. An `expression` is a dimension. A type that is not here (a `delta`, a `number`,
 * a `palette`) is a parameter of other tokens, and not a value of a style property. An `interactive` token is by the value of its states,
 * see {@link propertiesOfValue}.
 */
const propertiesByType: Readonly<Record<string, readonly StyleProperty[]>> = {
    [DesignToken.Type.FontFamily]: [StyleProperty.fontFamily],
    [DesignToken.Type.FontWeight]: [StyleProperty.fontWeight],
    [DesignToken.Type.Shadow]: [StyleProperty.shadow],
    [AdaptiveDesignToken.fontStyle]: [StyleProperty.fontStyle],
    [AdaptiveDesignToken.fontVariations]: [StyleProperty.fontVariationSettings],
    [DesignToken.Type.Color]: fills,
    [AdaptiveDesignToken.paint]: fills,
    [DesignToken.Type.Gradient]: fills,
    [DesignToken.Type.Dimension]: dimensions,
    [AdaptiveDesignToken.expression]: dimensions,
};

/**
 * Gets the style properties for the value of a state of an interactive token, which is what its type says about it.
 *
 * @remarks
 * The value is what the library gives it, so a color is a paint, a list of layers is a shadow, and a number or a `{ value, unit }` is a
 * dimension.
 */
function propertiesOfValue(value: unknown): readonly StyleProperty[] {
    if (isPaint(value)) {
        return fills;
    }
    if (Array.isArray(value)) {
        return [StyleProperty.shadow];
    }
    if (typeof value === "number" || (typeof value === "object" && value !== null && "unit" in value)) {
        return dimensions;
    }
    return [];
}

/**
 * Gets the style properties that a token is applied to: the ones it is intended for, or else all the ones that its `$type` can be.
 *
 * @remarks
 * `intendedFor` narrows where a token is offered, it is not required: a token of a type that is for one property doesn't need it, and a token
 * of a type that is for many and has none is offered for all of them, since a token that isn't offered looks like a bug. An `interactive`
 * token is for the properties of the value of its first state.
 * See `docs/decisions/0023-a-token-is-offered-for-what-it-is-intended-for.md`.
 *
 * @param token - The token
 * @returns The style properties, which are none for a token that is not a value of a style property
 */
export function propertiesOf(token: { readonly $type: string; readonly $value?: unknown; readonly $extensions: Record<string, any> }): readonly StyleProperty[] {
    const intended = getIntendedFor(token);
    if (intended.length > 0) {
        return intended;
    }
    if (token.$type === AdaptiveDesignToken.interactive) {
        const states = isInteractiveSet(token.$value) ? Object.values(token.$value) : [];
        return propertiesOfValue(states.find(value => value !== undefined && value !== null));
    }
    return propertiesByType[token.$type] ?? [];
}

// The name of a token: its path, and for the token of a group, the path of the group.
const nameOf = (path: readonly string[]): string => (path[path.length - 1] === "$root" ? path.slice(0, -1) : path).join(".");

/**
 * Whether a value is given: it has no ref and no computed value at any depth, so it is what was written and not derived from other tokens.
 */
export function isGiven(value: unknown): boolean {
    return !isRef(value) && !isComputed(value) && (typeof value !== "object" || value === null || Object.values(value).every(isGiven));
}

// The color context is a given token, but it is set by the node that has a fill, not by a designer.
const contextName = pathOf(tokens.color.context).join(".");

function* tokensOf(library: PluginLibrary): Generator<CatalogToken & { readonly record: Library.Token<any, any> }> {
    for (const { path, token } of entriesOf(library, { whatToShow: "token" })) {
        if (!token.$deprecated) {
            yield { name: nameOf(path), path, type: token.$type, appliesTo: propertiesOf(token), record: token as Library.Token<any, any> };
        }
    }
}

/**
 * The tokens that a designer applies to a style property: those that are intended for one, or else of a type that is a value of one.
 *
 * @param library - The library of the tokens
 * @returns The tokens, in the order of the library
 */
export function appliableTokens(library: PluginLibrary): CatalogToken[] {
    return [...tokensOf(library)].filter(token => token.appliesTo.length > 0).map(({ record: _, ...token }) => token);
}


/**
 * The tokens that a designer gives a value to: the ones whose configured value is given, of a type that a value can be written for.
 *
 * @remarks
 * A token that is derived from others, by a ref or a recipe, is not here: it follows what it is derived from, and a value given to it
 * would end that. See `docs/decisions/0024-the-designer-overrides-the-given-tokens.md`.
 *
 * @param library - The library of the tokens
 * @returns The tokens, in the order of the library
 */
export function givenTokens(library: PluginLibrary): CatalogToken[] {
    return [...tokensOf(library)]
        .filter(token => overridableTypes.has(token.type) && token.name !== contextName && isGiven(configuredValueOf(token.record)))
        .map(({ record: _, ...token }) => token);
}
