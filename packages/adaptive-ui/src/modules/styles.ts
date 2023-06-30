import type { CSSDirective } from "@microsoft/fast-element";
import type { CSSDesignToken } from "@microsoft/fast-foundation";
import { InteractiveColorRecipe, InteractiveColorRecipeBySet } from "../color/recipe.js";
import { Swatch } from "../color/swatch.js";
import { TypedDesignToken } from "../adaptive-design-tokens.js";
import { InteractiveTokenGroup } from "../types.js";
import { createForegroundSet, createForegroundSetBySet } from "../token-helpers-color.js";
import { StyleProperty } from "./types.js";

/**
 * Supported values for a style property.
 *
 * @public
 */
export type StyleValue = CSSDesignToken<any> | InteractiveTokenGroup<any> | CSSDirective | string;

/**
 * An object of style definitions, where the key is the {@link (StyleProperty:type)} and the value is the token or final value.
 *
 * @remarks
 * The `Record` format is a convenience for manual authoring of style modules (instead of a `Map`).
 *
 * @public
 */
export type StyleProperties = Partial<Record<StyleProperty, StyleValue>>;

/**
 * A `Map` of style definitions, where the key is the {@link (StyleProperty:type)} and the value is the token or final value.
 *
 * @public
 */
export type StylePropertiesMap = Map<StyleProperty, StyleValue>;

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
            foregroundFill: createForegroundSet(foregroundRecipe, "rest",  background),
        };
    },
    backgroundAndForegroundBySet: function(
        background: InteractiveTokenGroup<Swatch>,
        foregroundRecipe: TypedDesignToken<InteractiveColorRecipeBySet>
    ): StyleProperties {
        return {
            backgroundFill: background,
            foregroundFill: createForegroundSetBySet(foregroundRecipe,  background),
        };
    },
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
     * @returns A new Styles object representing the properties.
     */
    public static fromProperties(properties: StyleProperties, name?: string): Styles {
        return new Styles(name, properties);
    }
}
