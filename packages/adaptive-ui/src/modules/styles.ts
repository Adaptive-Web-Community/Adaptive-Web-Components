import type { CSSDirective } from "@microsoft/fast-element";
import type { CSSDesignToken } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe, InteractiveColorRecipeBySet } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import { TypedCSSDesignToken, TypedDesignToken } from "../adaptive-design-tokens.js";
import { InteractiveSet, InteractiveTokenGroup } from "../types.js";
import { createForegroundSet, createForegroundSetBySet } from "../token-helpers-color.js";
import { StyleModuleTarget, StyleProperty, StylePropertyCss } from "./types.js";

/**
 * Supported values for a style property.
 *
 * @public
 */
export type StyleValue = CSSDesignToken<any> | InteractiveSet<any | null> | CSSDirective | string | number;

/**
 * An object of style definitions, where the key is the {@link (StylePropertyCss:type)} and the value is the token or final value.
 *
 * @remarks
 * The `Record` format is a convenience for manual authoring of style modules (instead of a `Map`).
 *
 * @public
 */
export type StyleProperties = Partial<Record<StylePropertyCss, StyleValue>>;

/**
 * A `Map` of style definitions, where the key is the {@link (StylePropertyCss:type)} and the value is the token or final value.
 *
 * @public
 */
export type StylePropertiesMap = Map<StylePropertyCss, StyleValue>;

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
 * A modular definition of style properties, either an alias to another style module or a collection of style properties.
 *
 * @public
 */
export class Styles {
    // An array of composed styles
    private _composed?: Styles[];
    // Individual properties, or additional to composed style properties
    private _properties?: StylePropertiesMap;
    // Effective properties from composed styles and additional properties
    private _composedProperties?: StylePropertiesMap;

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

        if (Array.isArray(propertiesOrStyles)) {
            this._composed = propertiesOrStyles;
            this.createEffectiveProperties();
        } else {
            this._properties = new Map();
            for (const k in propertiesOrStyles) {
                const key: keyof StyleProperties = k as keyof StyleProperties;
                const value = propertiesOrStyles[key];
                if (value) {
                    this._properties.set(key, value);
                }
            }
        }

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
        this._composedProperties = undefined;
    }

    public appendComposed(styles: Styles): void {
        this._composed?.push(styles);
        this.createEffectiveProperties();
    }

    /**
     * The local properties or composition overrides.
     */
    public get properties(): StylePropertiesMap | undefined {
        return this._properties;
    }

    public set properties(properties: StylePropertiesMap | undefined) {
        this._properties = properties;
        this.createEffectiveProperties();
    }

    /**
     * Gets the full effective set of properties, from composed styles and local properties as applicable.
     */
    public get effectiveProperties(): StylePropertiesMap {
        if (this._composedProperties) {
            return this._composedProperties;
        } else if (this._properties) {
            return this._properties;
        } else {
            return new Map();
        }
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
        if (this._composed) {
            const map: StylePropertiesMap = new Map();
            this._composed.forEach((styles: Styles) => {
                styles.effectiveProperties.forEach((value, target) => {
                    map.set(target, value);
                });
            });
            this._properties?.forEach((value, target) => {
                map.set(target, value);
            });
            this._composedProperties = map;
        }
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
