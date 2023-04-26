import type { CSSDirective } from "@microsoft/fast-element";
import type { CSSDesignToken } from "@microsoft/fast-foundation";
import { InteractiveTokenSet } from "../types.js";
import { StyleProperty } from "./types.js";

/**
 * A collection of style definitions, where the key is the {@link (StyleProperty:type)} and the value is the token or final value.
 *
 * @public
 */
export type StyleProperties = Partial<Record<StyleProperty, CSSDesignToken<any> | InteractiveTokenSet<any> | CSSDirective | string>>;

/**
 * A modular definition of style properties, either an alias to another style module or a collection of style properties.
 *
 * @public
 */
export class Styles {
    private _alias: Styles;
    private _properties: StyleProperties;

    private constructor(propertiesOrStyles: StyleProperties | Styles) {
        if (propertiesOrStyles instanceof Styles) {
            this._alias = propertiesOrStyles;
        } else {
            this._properties = propertiesOrStyles;
        }
    }

    public get alias(): Styles {
        return this._alias;
    }

    public set alias(alias: Styles) {
        this._alias = alias;
        this._properties = {};
    }

    public get properties(): StyleProperties {
        if (this._alias) {
            return this._alias.properties;
        } else {
            return this._properties;
        }
    }

    public static fromAlias(styles: Styles): Styles {
        return new Styles(styles);
    }

    public static fromProperties(properties: StyleProperties): Styles {
        return new Styles(properties);
    }
}
