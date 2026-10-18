import { DesignToken, Library } from "design-token-library";
import { white } from "../core/color/utilities/color-constants.js";

/**
 * The tokens of the color context, under `color`.
 *
 * @public
 */
export interface ColorContextTokens {
    /**
     * The color that the content is on, which the recipes that need a reference read.
     *
     * @remarks
     * A layer is a library that is extended with the color of the layer as the context, so its content is made in it.
     */
    context: DesignToken.Color;
}

/**
 * The tokens of a library that has the color context.
 *
 * @public
 */
export interface ColorContextLibraryTokens {
    color: ColorContextTokens;
}

/**
 * The configuration of the color context, for the library.
 *
 * @public
 */
export const colorContext: Library.Config<ColorContextTokens, ColorContextLibraryTokens> = {
    context: {
        $type: DesignToken.Type.Color,
        $value: white,
    },
};
