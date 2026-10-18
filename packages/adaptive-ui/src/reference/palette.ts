import { DesignToken, hex, Library } from "design-token-library";
import { createPaletteOkhsl, stepCountFor } from "../core/color/palette-okhsl.js";
import { StyleProperty } from "../core/modules/types.js";
import { intendedFor } from "../core/token-metadata.js";
import { AdaptiveDesignToken, PaletteToken } from "../core/token-types.js";

/**
 * The base color of a palette and the palette that is made from it.
 *
 * @public
 */
export interface ColorPaletteTokens {
    base: DesignToken.Color;
    palette: PaletteToken;
}

/**
 * The tokens of the palettes of the system, under `color`.
 *
 * @remarks
 * A palette is made from the base color, so a system changes the palette by changing the base color, or sets the
 * palette itself with a `PaletteToken` value. Shared configuration parameters for palettes generation are in `paletteOptions`.
 *
 * @public
 */
export interface PaletteTokens {
    paletteOptions: {
        /**
         * The step between the swatches of a generated palette, in points of lightness on a scale of 100.
         */
        stepSize: DesignToken.Number;
    };
    neutral: ColorPaletteTokens;
    accent: ColorPaletteTokens;
    highlight: ColorPaletteTokens;
    critical: ColorPaletteTokens;
    warning: ColorPaletteTokens;
    success: ColorPaletteTokens;
    info: ColorPaletteTokens;
}

/**
 * The tokens of a library that has the palette tokens.
 *
 * @public
 */
export interface PaletteLibraryTokens {
    color: PaletteTokens;
}

const baseColorFor = intendedFor(StyleProperty.backgroundFill);

/**
 * The config of a palette token, made from a color and the step size of the palettes.
 *
 * @remarks
 * It is for a token the way a recipe is: the value is made by a function of the tokens, so the palette follows the color that it is made from,
 * which may be any color token of the library, and the step size. A system makes its own palette by calling it for a token of its own.
 *
 * @example
 * ```ts
 * accent: {
 *     base: { $type: DesignToken.Type.Color, $value: hex("#F26C0D") },
 *     palette: paletteFrom(t => t.color.accent.base.$value, t => t.color.paletteOptions.stepSize.$value),
 * },
 * ```
 *
 * @param base - Gets the color that the palette is made from, usually the value of a color token
 * @param stepSize - Gets the step between the swatches in points of lightness, the value of the token of the options of the palettes
 * @returns The config of the token, for a token of the `palette` type
 *
 * @public
 */
export function paletteFrom<Root extends object>(
    base: (tokens: Library.Context<Root>) => DesignToken.Values.Color,
    stepSize: (tokens: Library.Context<Root>) => number
): Library.ConfigValue<PaletteToken, Root> {
    return {
        $type: AdaptiveDesignToken.palette,
        $value: tokens => createPaletteOkhsl(base(tokens), { stepCount: stepCountFor(stepSize(tokens)) }),
    };
}

// The palette made from the color of a token, with the step size of the options of the palettes.
const palette = (base: (tokens: Library.Context<PaletteLibraryTokens>) => DesignToken.Values.Color) =>
    paletteFrom<PaletteLibraryTokens>(base, tokens => tokens.color.paletteOptions.stepSize.$value);

// The config of the base color of a palette, which is where the color is defined.
const baseColor = (value: DesignToken.Values.Color): Library.ConfigValue<DesignToken.Color, PaletteLibraryTokens> => ({
    $type: DesignToken.Type.Color,
    $value: value,
    $extensions: baseColorFor,
});

/**
 * The configuration of the palette tokens, for the library.
 *
 * @public
 */
export const palettes: Library.Config<PaletteTokens, PaletteLibraryTokens> = {
    paletteOptions: {
        stepSize: { $type: DesignToken.Type.Number, $value: 1.5 },
    },
    neutral: { base: baseColor(hex("#808080")), palette: palette(t => t.color.neutral.base.$value) },
    accent: { base: baseColor(hex("#F26C0D")), palette: palette(t => t.color.accent.base.$value) },
    highlight: { base: baseColor(hex("#0DA1F2")), palette: palette(t => t.color.highlight.base.$value) },
    critical: { base: baseColor(hex("#D92635")), palette: palette(t => t.color.critical.base.$value) },
    warning: { base: baseColor(hex("#D526D9")), palette: palette(t => t.color.warning.base.$value) },
    success: { base: baseColor(hex("#6AD926")), palette: palette(t => t.color.success.base.$value) },
    info: { base: baseColor(hex("#0DA1F2")), palette: palette(t => t.color.info.base.$value) },
};

/**
 * Creates a library with the palette tokens.
 *
 * @public
 */
export const createPaletteLibrary = () => Library.create<PaletteLibraryTokens>({ color: palettes });
