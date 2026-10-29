import { DesignToken, hex, Library, recipes, refs } from "design-token-library";
import type { Color } from "../core/color/color.js";
import type { Palette } from "../core/color/palette.js";
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
    disabled: {
        /**
         * The palette to use for the disabled state.
         */
        palette: PaletteToken;
    };
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
 * The recipes of the palettes, for a token of the `palette` type.
 *
 * @remarks
 * `paletteFrom` makes the palette of a color and the step size of the palettes, which may be any color token of the library, and the palette follows
 * them. A system makes its own palette with it for a token of its own, and changes how every palette is made with `override()` when it extends a
 * library.
 *
 * @example
 * ```ts
 * accent: {
 *     base: { $type: DesignToken.Type.Color, $value: hex("#F26C0D") },
 *     palette: { $type: AdaptiveDesignToken.palette, $value: paletteRecipes.paletteFrom(color.accent.base, color.paletteOptions.stepSize) },
 * },
 * ```
 *
 * @public
 */
export const paletteRecipes = recipes({
    paletteFrom: (base: Color, stepSize: number): Palette => createPaletteOkhsl(base, { stepCount: stepCountFor(stepSize) }),
});

const color = refs<PaletteLibraryTokens>().color;

// The palette made from the color of a token, with the step size of the options of the palettes.
const palette = (base: Library.Ref<Color, Library.TokenValues<PaletteLibraryTokens>>): Library.ConfigValue<PaletteToken, PaletteLibraryTokens> => ({
    $type: AdaptiveDesignToken.palette,
    $value: paletteRecipes.paletteFrom(base, color.paletteOptions.stepSize),
});

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
    neutral: { base: baseColor(hex("#808080")), palette: palette(color.neutral.base) },
    accent: { base: baseColor(hex("#F26C0D")), palette: palette(color.accent.base) },
    highlight: { base: baseColor(hex("#0DA1F2")), palette: palette(color.highlight.base) },
    critical: { base: baseColor(hex("#D92635")), palette: palette(color.critical.base) },
    warning: { base: baseColor(hex("#D526D9")), palette: palette(color.warning.base) },
    success: { base: baseColor(hex("#6AD926")), palette: palette(color.success.base) },
    info: { base: baseColor(hex("#0DA1F2")), palette: palette(color.info.base) },
    disabled: {
        palette: { $type: AdaptiveDesignToken.palette, $value: color.neutral.palette },
    },
};

/**
 * Creates a library with the palette tokens.
 *
 * @public
 */
export const createPaletteLibrary = () => Library.create<PaletteLibraryTokens>({ color: palettes });
