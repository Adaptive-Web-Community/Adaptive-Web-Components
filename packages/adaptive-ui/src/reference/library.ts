import { Library } from "design-token-library";
import { appearance } from "./appearance.js";
import { color } from "./color.js";
import { density, DensityLibraryTokens } from "./density.js";
import { elevation, ElevationLibraryTokens } from "./elevation.js";
import { typography, TypographyLibraryTokens } from "./typography.js";

/**
 * The tokens of the reference system: the appearance, the colors, the density, the shadows, and the typography.
 *
 * @public
 */
export interface ReferenceLibraryTokens extends TypographyLibraryTokens, ElevationLibraryTokens, DensityLibraryTokens {}

/**
 * The configuration of the tokens of the reference system, for the library.
 *
 * @public
 */
export const reference: Library.Config<ReferenceLibraryTokens, ReferenceLibraryTokens> = {
    ...appearance,
    typography,
    color,
    density,
    elevation,
};

/**
 * Creates a library with the tokens of the reference system, which the reference treatments refer to.
 *
 * @public
 */
export const createReferenceLibrary = () => Library.create<ReferenceLibraryTokens>(reference);
