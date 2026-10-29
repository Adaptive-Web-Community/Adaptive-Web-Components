import { DesignToken, Library, px } from "design-token-library";
import { StylePropertyShorthand } from "../core/styles/properties.js";
import { tokenMetadata } from "../core/token-metadata.js";

/**
 * The tokens of the shapes of the appearance: the design unit, the radius of the corners, and the thickness of the strokes.
 *
 * @public
 */
export interface AppearanceTokens {
    global: {
        /**
         * The unit of the spacing, which the density is a multiple of.
         */
        designUnit: DesignToken.Dimension;
    };
    shape: {
        cornerRadius: {
            default: DesignToken.Dimension;
            /**
             * The corner radius of a layer, which is more than that of a control.
             */
            layer: DesignToken.Dimension;
        };
        strokeThickness: {
            default: DesignToken.Dimension;
            focus: DesignToken.Dimension;
        };
    };
}

/**
 * The configuration of the appearance tokens, for the library.
 *
 * @public
 */
export const appearance: Library.Config<AppearanceTokens, AppearanceTokens> = {
    global: {
        designUnit: { $type: DesignToken.Type.Dimension, $value: px(4) },
    },
    shape: {
        cornerRadius: {
            default: {
                $type: DesignToken.Type.Dimension,
                $value: px(4),
                $extensions: tokenMetadata({ intendedFor: StylePropertyShorthand.cornerRadius, formerNames: ["corner-radius-control"] }),
            },
            layer: {
                $type: DesignToken.Type.Dimension,
                $value: px(8),
                $extensions: tokenMetadata({
                    intendedFor: StylePropertyShorthand.cornerRadius,
                    formerNames: ["density.layer.cornerRadius", "corner-radius-layer"],
                }),
            },
        },
        strokeThickness: {
            default: {
                $type: DesignToken.Type.Dimension,
                $value: px(1),
                $extensions: tokenMetadata({ intendedFor: StylePropertyShorthand.borderThickness, formerNames: ["stroke-thickness"] }),
            },
            focus: {
                $type: DesignToken.Type.Dimension,
                $value: px(2),
                $extensions: tokenMetadata({ intendedFor: StylePropertyShorthand.borderThickness, formerNames: ["focus-stroke-thickness"] }),
            },
        },
    },
};

/**
 * Creates a library with the appearance tokens.
 *
 * @public
 */
export const createAppearanceLibrary = () => Library.create<AppearanceTokens>(appearance);
