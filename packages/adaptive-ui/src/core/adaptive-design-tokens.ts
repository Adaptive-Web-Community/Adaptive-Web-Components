import { CSSDirective, cssDirective, htmlDirective } from "@microsoft/fast-element";
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
    boolean: "boolean",
    fontStyle: "fontStyle",
    fontVariations: "fontVariations",
    palette: "palette",
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
    private _type: DesignTokenType = "string";

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
 * A global registry for looking up Design Tokens by ID.
 *
 * @public
 */
export abstract class DesignTokenRegistry {
    /**
     * The shared Design Token registry.
     */
    public static Shared = new Map<string, DesignToken<any>>();
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
        const token = new TypedDesignToken<T>(name, type, intendedFor);
        DesignTokenRegistry.Shared.set(name, token);
        return token;
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
        const cssName = name.replace(/\./g, "-");
        super({ name, cssCustomPropertyName: cssName });
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
        const token = new TypedCSSDesignToken<T>(name, type, intendedFor);
        DesignTokenRegistry.Shared.set(name, token);
        return token;
    }
}

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypedCSSDesignToken<T> extends DesignTokenMetadata {}
applyMixins(TypedCSSDesignToken, DesignTokenMetadata);

/**
 * A design token value for css properties which can have multiple values, like `box-shadow`.
 *
 * @public
 */
export class DesignTokenMultiValue<T extends CSSDirective | string> extends Array<T> implements CSSDirective {
    /**
     * {@inheritdoc @microsoft/fast-element#CSSDirective.createCSS}
     */
    public createCSS(): string {
        const stringValues = this.map((value) =>
            value && typeof (value as any).createCSS === "function"
                ? (value as any).createCSS()
                : value
        );

        return stringValues.join(", ");
    }
}
