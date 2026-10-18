import { CSSConverter, CSSPropertiesOptions, Library, toProperties } from "design-token-library";
import { formatExpression, OperandValue } from "./expression.js";

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
        fontStyle: (value: string) => value,
        fontVariations: (value: string) => value,
        // A palette is not CSS. The library has no way yet to leave a token out (library #58), so it is an empty value.
        palette: () => "",
        expression: ((value: OperandValue) => formatExpression(value, property)) as CSSConverter<OperandValue, any>,
    };
}

/**
 * Gets what a token is, from its name, for {@link evaluate}.
 *
 * @param library - The library of tokens
 * @returns A function that gets the value of the token with the name
 *
 * @public
 */
export function tokenResolver(library: Library.Library<any>): (name: string) => OperandValue {
    return (name: string) => {
        const token = atName<{ $value: OperandValue }>(library.tokens, name);
        if (!("$value" in token)) {
            throw new Error(`There is no token named ${name}`);
        }
        return token.$value;
    };
}
