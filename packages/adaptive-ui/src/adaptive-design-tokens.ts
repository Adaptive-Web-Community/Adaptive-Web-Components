import { cssDirective, htmlDirective } from "@microsoft/fast-element";
import { CSSDesignToken, ValuesOf } from "@microsoft/fast-foundation";
import { StyleProperty } from "./index.js";

/**
 * Standard design token types from the community group and new types defined in Adaptive UI.
 *
 * @public
 */
export const DesignTokenType = {
    // From the DTCG recommended format
    color: "color",
    dimension: "dimension",
    fontFamily: "fontFamily",
    fontWeight: "fontWeight",
    duration: "duration",
    cubicBezier: "cubicBezier",
    number: "number",
    strokeStyle: "strokeStyle",
    border: "border",
    transition: "transition",
    shadow: "shadow",
    gradient: "gradient",
    typography: "typography",
    // Added in Adaptive UI
    fontStyle: "fontStyle",
    fontVariations: "fontVariations",
} as const;

/**
 * A design token data type, either from the community group, Adaptive UI, or custom.
 *
 * @public
 */
export type DesignTokenType = ValuesOf<typeof DesignTokenType> | string;

/**
 * A DesignToken with allowed types and intended styling uses.
 *
 * @public
 */
@cssDirective()
@htmlDirective()
export class TypedCSSDesignToken<T> extends CSSDesignToken<T> {
    public readonly allowedTypes: DesignTokenType[];
    public readonly intendedFor?: StyleProperty[]

    constructor(name: string, allowedTypes: DesignTokenType | DesignTokenType[], intendedFor?: StyleProperty | StyleProperty[]) {
        super({ name, cssCustomPropertyName: name });
        this.allowedTypes = [...allowedTypes];
        if (intendedFor) {
            this.intendedFor = [...intendedFor] as StyleProperty[];
        }
    }

    /**
     * Factory to create a DesignToken with allowed types and intended styling uses.
     */
    public static createTyped<T>(
        name: string,
        allowedTypes: DesignTokenType | DesignTokenType[],
        intendedFor?: StyleProperty | StyleProperty[],
    ): TypedCSSDesignToken<T> {
        return new TypedCSSDesignToken<T>(name, allowedTypes, intendedFor);
    }
}
