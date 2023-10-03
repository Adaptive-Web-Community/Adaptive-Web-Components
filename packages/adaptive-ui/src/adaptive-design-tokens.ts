import { cssDirective, htmlDirective } from "@microsoft/fast-element";
import { CSSDesignToken, DesignToken, ValuesOf } from "@microsoft/fast-foundation";
import { applyMixins } from './apply-mixins.js';
import { StyleProperty } from "./modules/types.js";

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
    recipe: "recipe",
    string: "string",
} as const;

/**
 * A design token data type, either from the community group, Adaptive UI, or custom.
 *
 * @public
 */
export type DesignTokenType = ValuesOf<typeof DesignTokenType> | string;

/**
 * Metadata describing the value type and intended styling uses of a DesignToken.
 *
 * @public
 */
export class DesignTokenMetadata {
    // TODO: This needs to support multiple types, tokens in Adaptive UI might represent different value
    // types, like a Swatch type commonly refers to a `color` but may also be a `gradient`. (see `create.ts`)
    private _type: DesignTokenType;

    /**
     * Gets the value type for this token.
     */
    public get type(): DesignTokenType {
        return this._type;
    }

    protected set type(value: DesignTokenType) {
        this._type = value;
    }

    private _intendedFor?: StyleProperty[];

    /**
     * Gets intended styling uses for this token.
     */
    public get intendedFor(): StyleProperty[] | undefined {
        return this._intendedFor;
    }

    protected set intendedFor(value: StyleProperty[] | undefined) {
        this._intendedFor = value;
    }

    protected init(type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]) {
        this.type = type;
        if (intendedFor) {
            if (Array.isArray(intendedFor)) {
                this.intendedFor = intendedFor;
            } else {
                this.intendedFor = [intendedFor];
            }
        }
    }
}

/**
 * A DesignToken with value type and intended styling uses.
 *
 * @public
 */
export class TypedDesignToken<T> extends DesignToken<T> implements DesignTokenMetadata {
    constructor(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]) {
        super({ name });
        this.init(type, intendedFor);
    }

    /**
     * Factory to create a DesignToken with value type and intended styling uses.
     */
    public static createTyped<T>(
        name: string,
        type: DesignTokenType,
        intendedFor?: StyleProperty | StyleProperty[],
    ): TypedDesignToken<T> {
        return new TypedDesignToken<T>(name, type, intendedFor);
    }
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypedDesignToken<T> extends DesignTokenMetadata {}
applyMixins(TypedDesignToken, DesignTokenMetadata);

/**
 * A CSSDesignToken with value type and intended styling uses.
 *
 * @public
 */
@cssDirective()
@htmlDirective()
export class TypedCSSDesignToken<T> extends CSSDesignToken<T> implements DesignTokenMetadata {
    constructor(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]) {
        super({ name, cssCustomPropertyName: name });
        this.init(type, intendedFor);
    }

    /**
     * Factory to create a DesignToken with value type and intended styling uses.
     */
    public static createTyped<T>(
        name: string,
        type: DesignTokenType,
        intendedFor?: StyleProperty | StyleProperty[],
    ): TypedCSSDesignToken<T> {
        return new TypedCSSDesignToken<T>(name, type, intendedFor);
    }
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypedCSSDesignToken<T> extends DesignTokenMetadata {}
applyMixins(TypedCSSDesignToken, DesignTokenMetadata);
