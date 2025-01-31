import type { CSSDirective } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe, InteractiveColorRecipeBySet } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import { TypedCSSDesignToken, TypedDesignToken } from "../adaptive-design-tokens.js";
import { InteractiveTokenGroup, InteractiveValues } from "../types.js";
import { createForegroundSet, createForegroundSetBySet } from "../token-helpers-color.js";
import { StyleModuleTarget, StyleProperty, StylePropertyShorthand } from "./types.js";

/**
 * Key for a style property, a {@link (StyleProperty:type)}, {@link (StylePropertyShorthand:type)}, or a string for any other CSS property.
 *
 * @public
 */
export type StyleKey = StyleProperty | StylePropertyShorthand | (string & Record<never, never>);

/**
 * Supported values for a style property.
 *
 * @public
 */
export type StyleValue = CSSDesignToken<any> | InteractiveValues<any | null> | CSSDirective | string | number;

/**
 * An object of style definitions, where the key is the {@link (StyleKey:type)} and the value is the token or final value.
 *
 * @remarks
 * The `Record` format is a convenience for manual authoring of style modules (instead of a `Map`).
 *
 * @public
 */
export type StyleProperties = Partial<Record<StyleKey, StyleValue>>;

/**
 * A `Map` of style definitions, where the key is the {@link (StyleKey:type)} and the value is the token or final value.
 *
 * @public
 */
export type StylePropertiesMap = Map<StyleKey, StyleValue>;

/**
 * A `Map` of style definitions, where the key is a string and the value is the token or final value.
 *
 * @public
 */
export type EffectiveStylePropertiesMap = Map<string, StyleValue>;

/**
 * The properties and values for a {@link StyleRule} definition.
 *
 * A declaration should have `styles` and/or `properties` - `styles` are applied before `properties`.
 *
 * @public
 */
export type StyleDeclaration = {
    /**
     * The {@link Styles} for this rule.
     * 
     * @remarks
     * Optional. If not applicable, provide `properties`.
     */
    styles?: Styles | Iterable<Styles>;

    /**
     * A collection of properties to define a new {@link Styles} or augment those provided as `styles`.
     *
     * @remarks
     * Optional. If not applicable, provide `styles`.
     */
    properties?: StyleProperties;
};

/**
 * Definition for a single Adaptive UI style rule, which maps to a rule in a normal CSS style sheet.
 *
 * @public
 */
export type StyleRule = {
    /**
     * The target for the style rule, used to build the CSS selector.
     * 
     * @remarks
     * Optional. If not supplied defaults to the host element for web components.
     */
    target?: StyleModuleTarget;
} & StyleDeclaration;

/**
 * @public
 */
export const Fill = {
    backgroundAndForeground: function(
        background: InteractiveTokenGroup<Swatch>,
        foregroundRecipe: TypedDesignToken<InteractiveColorRecipe>
    ): StyleProperties {
        return {
            backgroundFill: background,
            foregroundFill: createForegroundSet(foregroundRecipe, background),
        };
    },

    backgroundAndForegroundBySet: function(
        background: InteractiveTokenGroup<Swatch>,
        foregroundRecipe: TypedDesignToken<InteractiveColorRecipeBySet>
    ): StyleProperties {
        return {
            backgroundFill: background,
            foregroundFill: createForegroundSetBySet(foregroundRecipe, background),
        };
    },

    foregroundNonInteractiveWithDisabled: function(
        foreground: TypedCSSDesignToken<Swatch>,
        disabled: TypedCSSDesignToken<Swatch>,
    ): StyleProperties {
        return {
            foregroundFill: {
                name: `${foreground.name}-with-disabled-value`,
                rest: foreground,
                hover: foreground,
                active: foreground,
                focus: foreground,
                disabled,
            } as InteractiveTokenGroup<Swatch>,
        }
    }
}

/**
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const BorderFill = {
    all: function(value: StyleValue): StyleProperties {
        return {
            borderFillTop: value,
            borderFillRight: value,
            borderFillBottom: value,
            borderFillLeft: value,
        };
    },
}

/**
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const BorderThickness = {
    all: function(value: StyleValue): StyleProperties {
        return {
            borderThicknessTop: value,
            borderThicknessRight: value,
            borderThicknessBottom: value,
            borderThicknessLeft: value,
        };
    },
}

/**
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const BorderStyle = {
    all: function(value: StyleValue): StyleProperties {
        return {
            borderStyleTop: value,
            borderStyleRight: value,
            borderStyleBottom: value,
            borderStyleLeft: value,
        };
    },
}

/**
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const CornerRadius = {
    all: function(value: StyleValue): StyleProperties {
        return {
            cornerRadiusTopLeft: value,
            cornerRadiusTopRight: value,
            cornerRadiusBottomRight: value,
            cornerRadiusBottomLeft: value,
        };
    },
}

/**
 * @public
 * @deprecated Use StylePropertyShorthand instead
 */
export const Padding = {
    all: function(value: StyleValue): StyleProperties {
        return {
            paddingTop: value,
            paddingRight: value,
            paddingBottom: value,
            paddingLeft: value,
        };
    },

    verticalHorizontal: function(valueVertical: StyleValue, valueHorizontal: StyleValue): StyleProperties {
        return {
            paddingTop: valueVertical,
            paddingRight: valueHorizontal,
            paddingBottom: valueVertical,
            paddingLeft: valueHorizontal,
        };
    },
}

/**
 * Converts `Styles` to focus-only state. This allows styles to be constructed as usual, using interactive sets
 * or simple values, but convert the styles specifically to focus state to the necessary structure.
 *
 * @param styles - The input `Styles` to convert to focus-only styles.
 * @returns Converted `Styles`.
 *
 * @public
 */
export const convertStylesToFocusState = (styles: Styles) => {
    const props: StyleProperties = {};
    styles.effectiveProperties.forEach((value, target) => {
        let focusValue: StyleValue | null;
        if (typeof value === "string" || value instanceof CSSDesignToken) {
            focusValue = value;
        } else if (value && typeof (value as any).createCSS === "function") {
            focusValue = value;
        } else {
            focusValue = (value as InteractiveValues<any>).focus;
        }

        if (focusValue) {
            props[target] = {
                rest: undefined,
                hover: undefined,
                active: undefined,
                focus: focusValue,
                disabled: undefined,
            };
        }
    });
    return Styles.fromProperties(props);
};

/**
 * A composable definition of style properties, either an alias to another style or a collection of style properties.
 *
 * @public
 */
export class Styles {
    // An array of composed styles
    private _composed?: Styles[];
    // Individual properties, or additional to composed style properties
    private _properties?: StylePropertiesMap;
    // Effective properties from composed styles and additional properties
    private _effectiveProperties: EffectiveStylePropertiesMap = new Map();

    private constructor(
        /**
         * The style module name.
         */
        public readonly name: string | undefined,
        propertiesOrStyles: StyleProperties | Styles[]
    ) {
        if (name && Styles.Shared.has(name)) {
            throw `Style '${name}' already created. Update it instead.`;
        }

        if (Array.isArray(propertiesOrStyles)) { // styles
            this._composed = propertiesOrStyles;
        } else { // properties
            this._properties = new Map();
            for (const k in propertiesOrStyles) {
                const key: keyof StyleProperties = k as keyof StyleProperties;
                const value = propertiesOrStyles[key];
                if (value) {
                    this._properties.set(key, value);
                }
            }
        }

        this.createEffectiveProperties();

        if (name) {
            Styles.Shared.set(name, this);
        }
    }

    /**
     * Gets the array of composed styles.
     */
    public get composed(): Styles[] | undefined {
        return this._composed;
    }

    /**
     * Clears the array of composed styles.
     */
    public clearComposed(): void {
        this._composed = undefined;
        this.createEffectiveProperties();
    }

    public appendComposed(styles: Styles): void {
        if (this._composed === undefined) {
            this._composed = [];
        }
        this._composed.push(styles);
        this.createEffectiveProperties();
    }

    /**
     * The local properties or composition overrides.
     */
    public get properties(): Readonly<StylePropertiesMap> | undefined {
        return this._properties;
    }

    public set properties(properties: StylePropertiesMap | undefined) {
        this._properties = properties;
        this.createEffectiveProperties();
    }

    /**
     * Gets the full effective set of properties, from composed styles and local properties as applicable.
     */
    public get effectiveProperties(): EffectiveStylePropertiesMap {
        return this._effectiveProperties;
    }

    /**
     * Gets the set of effective properties that support Adaptive UI design-to-code.
     */
    public get effectiveAdaptiveProperties(): Map<StyleProperty, StyleValue> {
        const entries = [...this.effectiveProperties];
        const filtered = entries.filter(([styleProperty]) => { return styleProperty in StyleProperty}) as [StyleProperty, StyleValue][];
        return new Map(filtered);
    }

    private createEffectiveProperties() {
        const map: EffectiveStylePropertiesMap = new Map();

        if (this._composed) {
            this._composed.forEach((styles: Styles) => {
                styles.effectiveProperties.forEach((value, target) => {
                    map.set(target, value);
                });
            });
        }

        if (this._properties) {
            this._properties.forEach((value, target) => {
                if (target in StylePropertyShorthand) {
                    const props: StyleProperty[] = StylePropertyShorthand[target as StylePropertyShorthand];
                    props.forEach(prop => {
                        map.set(prop, value);
                    });
                } else {
                    map.set(target, value);
                }
            });
        }

        this._effectiveProperties = map;
    }

    public static Shared: Map<string, Styles> = new Map();

    /**
     * Creates a new Styles object for the composed styles.
     *
     * @param styles - An array of styles to compose.
     * @param properties - Individual properties to append to the styles.
     * @param name - A name for the styles used for lookup.
     * @returns A new Styles object representing the composed styles.
     */
    public static compose(styles: Styles[], properties?: StyleProperties, name?: string): Styles {
        if (properties) {
            styles.push(Styles.fromProperties(properties));
        }
        return new Styles(name, styles);
    }

    /**
     * Creates a new Styles object for the individual properties.
     *
     * @param properties - Individual properties for the new style module.
     * @param name - A name for the styles used for lookup.
     * @returns A new Styles object representing the properties.
     */
    public static fromProperties(properties: StyleProperties, name?: string): Styles {
        return new Styles(name, properties);
    }

    /**
     * Creates a new Styles object for the declared styles.
     *
     * @param declaration - The style declaration
     * @param name - A name for the styles used for lookup.
     * @returns A new Styles object representing the declared styles.
     */
    public static fromDeclaration(declaration: StyleDeclaration, name?: string) {
        const styles: Array<Styles> = declaration.styles ?
            (Array.isArray(declaration.styles) ? declaration.styles : [declaration.styles]) :
            [];
        const composed = Styles.compose(styles, declaration.properties, name);
        return composed;
    }
}
