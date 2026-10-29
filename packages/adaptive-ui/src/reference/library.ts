import { Library } from "design-token-library";
import { appearance } from "./appearance.js";
import { color, ColorTokens } from "./color.js";
import { density, DensityLibraryTokens } from "./density.js";
import { elevation, ElevationLibraryTokens } from "./elevation.js";
import { experimentalColor, ExperimentalColorTokens, ExperimentalLibraryTokens } from "./experimental.js";
import { typography, TypographyLibraryTokens } from "./typography.js";

/**
 * The tokens of the reference system: the appearance, the colors, the density, the shadows, and the typography, and the experimental
 * gradients with the colors.
 *
 * @public
 */
export interface ReferenceLibraryTokens extends TypographyLibraryTokens, ElevationLibraryTokens, DensityLibraryTokens, ExperimentalLibraryTokens {
    color: ColorTokens & ExperimentalColorTokens;
}

/**
 * The configuration of the tokens of the reference system, for the library.
 *
 * @public
 */
export const reference: Library.Config<ReferenceLibraryTokens, ReferenceLibraryTokens> = {
    ...appearance,
    typography,
    color: { ...color, ...experimentalColor },
    density,
    elevation,
};

/**
 * Creates a library with the tokens of the reference system, which the reference treatments refer to.
 *
 * @public
 */
export const createReferenceLibrary = () => Library.create<ReferenceLibraryTokens>(reference);
