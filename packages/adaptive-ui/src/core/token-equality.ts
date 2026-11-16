import type { AdaptiveDesignToken } from "./token-types.js";

/**
 * Tells whether two values of plain data are equal, part by part: primitives by `Object.is`, arrays by their elements, and objects by
 * their properties.
 *
 * @remarks
 * The values of Adaptive UI's tokens are plain data (a color, a palette, a set of values for the states of an element), so one test
 * serves all of its custom types. A value that isn't plain, like a function, is equal only to itself.
 *
 * @param previous - The value a token had
 * @param next - The value it resolved to
 * @returns Whether they are equal
 *
 * @public
 */
export function isPlainEqual(previous: unknown, next: unknown): boolean {
    if (Object.is(previous, next)) {
        return true;
    }
    if (typeof previous !== "object" || typeof next !== "object" || previous === null || next === null) {
        return false;
    }
    if (Array.isArray(previous) || Array.isArray(next)) {
        return (
            Array.isArray(previous) &&
            Array.isArray(next) &&
            previous.length === next.length &&
            previous.every((element, i) => isPlainEqual(element, next[i]))
        );
    }
    const keys = Object.keys(previous);
    return (
        keys.length === Object.keys(next).length &&
        keys.every(key => Object.prototype.hasOwnProperty.call(next, key) && isPlainEqual((previous as any)[key], (next as any)[key]))
    );
}

const plain = { isEqual: isPlainEqual };

/**
 * The custom types of Adaptive UI, to register when making a library of its tokens: each tells whether two of its values are equal, so
 * a token that resolves to an equal value keeps the one it had, and a subscriber isn't told of a change.
 *
 * @example
 * ```ts
 * const library = Library.create<MyTokens>(config, { types: adaptiveTokenTypes });
 * ```
 *
 * @public
 */
export const adaptiveTokenTypes: { readonly [N in keyof typeof AdaptiveDesignToken]: { isEqual(previous: any, next: any): boolean } } = {
    boolean: plain,
    contrastRatio: plain,
    delta: plain,
    expression: plain,
    fontStyle: plain,
    fontVariations: plain,
    interactive: plain,
    paint: plain,
    palette: plain,
    treatment: plain,
    wcagContrastLevel: plain,
};
