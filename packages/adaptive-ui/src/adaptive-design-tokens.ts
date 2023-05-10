import { cssDirective, htmlDirective } from "@microsoft/fast-element";
import { applyMixins, CSSDesignToken, DesignToken, ValuesOf } from "@microsoft/fast-foundation";
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
 * Metadata describing the allowed types of a DesignToken.
 *
 * @public
 */
export class DesignTokenMetadata {
    // TODO: This needs to support multiple types, tokens in Adaptive UI might represent different value
    // types, like a Swatch type commonly refers to a `color` but may also be a `gradient`. (see `create.ts`)
    private _allowedType: DesignTokenType;

    public get allowedType(): DesignTokenType {
        return this._allowedType;
    }

    protected set allowedType(value: DesignTokenType) {
        this._allowedType = value;
    }
}

/**
 * A DesignToken with allowed types.
 *
 * @public
 */
export class TypedDesignToken<T> extends DesignToken<T> implements DesignTokenMetadata {
    constructor(name: string, allowedType: DesignTokenType) {
        super({ name });
        this.allowedType = allowedType;
    }

    /**
     * Factory to create a DesignToken with allowed types.
     */
    public static createTyped<T>(
        name: string,
        allowedType: DesignTokenType,
    ): TypedDesignToken<T> {
        return new TypedDesignToken<T>(name, allowedType);
    }
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypedDesignToken<T> extends DesignTokenMetadata {}
applyMixins(TypedDesignToken, DesignTokenMetadata);

/**
 * A CSSDesignToken with allowed types and intended styling uses.
 *
 * @public
 */
@cssDirective()
@htmlDirective()
export class TypedCSSDesignToken<T> extends CSSDesignToken<T> implements DesignTokenMetadata {
    public readonly intendedFor?: StyleProperty[];

    constructor(name: string, allowedType: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]) {
        super({ name, cssCustomPropertyName: name });
        this.allowedType = allowedType;
        if (intendedFor) {
            if (Array.isArray(intendedFor)) {
                this.intendedFor = intendedFor;
            } else {
                this.intendedFor = [intendedFor];
            }
        }
    }

    /**
     * Factory to create a DesignToken with allowed types and intended styling uses.
     */
    public static createTyped<T>(
        name: string,
        allowedType: DesignTokenType,
        intendedFor?: StyleProperty | StyleProperty[],
    ): TypedCSSDesignToken<T> {
        return new TypedCSSDesignToken<T>(name, allowedType, intendedFor);
    }
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypedCSSDesignToken<T> extends DesignTokenMetadata {}
applyMixins(TypedCSSDesignToken, DesignTokenMetadata);
