import type { CSSDirective } from "@microsoft/fast-element";
import type { CSSDesignToken } from "@microsoft/fast-foundation";
import { InteractiveTokenGroup } from "../types.js";
import { StyleProperty } from "./types.js";

/**
 * A collection of style definitions, where the key is the {@link (StyleProperty:type)} and the value is the token or final value.
 *
 * @public
 */
export type StyleProperties = Partial<Record<StyleProperty, CSSDesignToken<any> | InteractiveTokenGroup<any> | CSSDirective | string>>;

/**
 * A modular definition of style properties, either an alias to another style module or a collection of style properties.
 *
 * @public
 */
export class Styles {
    // An array of composed styles
    private _composed?: Styles[];
    // Individual properties, or additional to composed style properties
    private _properties?: StyleProperties;
    // Effective properties from composed styles and additional properties
    private _composedProperties?: StyleProperties;

    private constructor(propertiesOrStyles: StyleProperties | Styles[]) {
        if (Array.isArray(propertiesOrStyles)) {
            this._composed = propertiesOrStyles;
            this.createEffectiveProperties();
        } else {
            this._properties = propertiesOrStyles;
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
    public get properties(): StyleProperties | undefined {
        return this._properties;
    }

    public set properties(properties: StyleProperties | undefined) {
        this._properties = properties;
        this.createEffectiveProperties();
    }

    /**
     * Gets the full effective set of properties, from composed styles and local properties as applicable.
     */
    public get effectiveProperties(): StyleProperties {
        if (this._composedProperties) {
            return this._composedProperties;
        } else if (this._properties) {
            return this._properties;
        } else {
            return {};
        }
    }

    private createEffectiveProperties() {
        if (this._composed) {
            const propsArray: Array<StyleProperties> = this._composed.map((styles: Styles) => styles.effectiveProperties);
            const props: StyleProperties = Object.assign(
                {},
                ...propsArray,
                this._properties
            );
            this._composedProperties = props;
        }
    }

    /**
     * Creates a new Styles object for the composed styles.
     *
     * @param styles - An array of styles to compose.
     * @returns A new Styles object representing the composed styles.
     */
    public static compose(...styles: Styles[]): Styles {
        return new Styles(styles);
    }

    /**
     * Creates a new Styles object for the individual properties.
     *
     * @param properties - Individual properties for the new style module.
     * @returns A new Styles object representing the properties.
     */
    public static fromProperties(properties: StyleProperties): Styles {
        return new Styles(properties);
    }
}
