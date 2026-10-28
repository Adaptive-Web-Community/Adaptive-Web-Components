import { CSSPropertiesOptions, Library, toProperties } from "design-token-library";
import { formatPaint, Paint } from "./color/paint.js";
import { formatExpression, Operand } from "./expression.js";
import { InteractiveSet } from "./interactive.js";

// Gets what is at the name of a token in a tree of the tokens of a library.
function atName<T>(tree: any, name: string): T {
    let value = tree;
    for (const key of name.split(".")) {
        value = value?.[key];
    }
    if (value === undefined) {
        throw new Error(`There is no token named ${name}`);
    }
    return value;
}

/**
 * Gets the name of the custom property of a token, from the name of the token, as the library names it.
 *
 * @param library - The library of tokens
 * @param options - The options given to the library to write CSS, if it names a custom property its own way
 * @returns A function that gets the name of the custom property, with the leading `--`
 *
 * @public
 */
export function propertyResolver(library: Library.Library<any>, options?: CSSPropertiesOptions): (name: string) => string {
    const properties = toProperties(library, options);
    return (name: string) => atName<{ property: string }>(properties, name).property;
}

type Dimensional = { value: number; unit: string };

/**
 * Writes a value of an interactive token. They are plain data, so the shape tells what one is.
 */
function formatMember(value: unknown): string {
    if (typeof value === "object" && value !== null) {
        if ("colorSpace" in value || "stops" in value) {
            return formatPaint(value as Paint);
        }
        if ("unit" in value) {
            const { value: amount, unit } = value as Dimensional;
            return `${amount}${unit}`;
        }
    }
    return String(value);
}

/**
 * The converters for the custom token types of Adaptive UI, to give to the library when writing CSS.
 *
 * @param library - The library of tokens, which tells the name of the custom property of a token
 * @param options - The options given to the library to write CSS, if it names a custom property its own way
 * @returns A converter for each type in {@link AdaptiveDesignToken}
 *
 * @public
 */
export function adaptiveConverters(library: Library.Library<any>, options?: CSSPropertiesOptions) {
    const property = propertyResolver(library, options);
    return {
        // A switch, a contrast ratio, a delta, and a WCAG level are read by a recipe, which is calculated in JavaScript, so they are not CSS,
        // as they weren't in 0.14.
        boolean: false as const,
        contrastRatio: false as const,
        delta: false as const,
        fontStyle: (value: string) => value,
        fontVariations: (value: string) => value,
        // The `rest` is the value of the property and the other states are more declarations after it, named `--name-<state>`,
        // until the library can write more than one property for a token (library #64). A state that has no value is not written,
        // and the property of a set that has no `rest` is empty.
        interactive: (value: InteractiveSet<unknown>, token: { name: string }) => {
            const base = property(token.name);
            const given = Object.entries(value).filter(([, v]) => v !== undefined && v !== null);
            const others = given.filter(([state]) => state !== "rest").map(([state, v]) => `${base}-${state}:${formatMember(v)}`);
            return [value.rest === undefined || value.rest === null ? "" : formatMember(value.rest), ...others].join(";");
        },
        // A palette is not CSS.
        palette: false as const,
        wcagContrastLevel: false as const,
        expression: (value: Operand) => formatExpression(value, property),
    };
}
