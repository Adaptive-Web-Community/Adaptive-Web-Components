import {
    ColorRecipeParams,
    contrastSwatch,
    createNonCss,
    createTokenColor,
    createTokenColorRecipe,
    createTokenColorRecipeValue,
    createTokenSwatch,
    InteractiveSwatchSet,
    Palette,
    PaletteRGB,
    StyleProperty,
    stylePropertyBorderFillAll,
} from "@adaptive-web/adaptive-ui";
import {
    blackOrWhiteDiscernibleRecipe,
    blackOrWhiteReadableRecipe,
    fillColor
} from "@adaptive-web/adaptive-ui/reference";
import { DesignTokenResolver } from "@microsoft/fast-foundation";

// Local recipes for use in documentation files.

export const docBaseColor = createTokenColor("color.doc.base").withDefault("#E1477E");

export const docPalette = createNonCss<Palette>("color.doc.palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteRGB.from(resolve(docBaseColor))
);

export const docForegroundRecipe = createTokenColorRecipe(
    "color.doc.foreground",
    [...stylePropertyBorderFillAll, StyleProperty.foregroundFill],
    (resolve: DesignTokenResolver, params?: ColorRecipeParams) =>
        contrastSwatch(
            resolve(docPalette),
            params?.reference || resolve(fillColor),
            4.5,
        ),
);

export const docForeground = createTokenColorRecipeValue(docForegroundRecipe);

export const docFillRecipe = createTokenColorRecipe(
    "color.doc.fill",
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params?: ColorRecipeParams) =>
        contrastSwatch(
            resolve(docPalette),
            params?.reference || resolve(fillColor),
            5,
        ),
);

export const docFill = createTokenColorRecipeValue(docFillRecipe);

// Placeholder tokens for `blackOrWhite` recipes, which have special handling in style modules.

export const blackOrWhiteDiscernibleRest = createTokenSwatch("color.blackOrWhite.discernible.rest", StyleProperty.foregroundFill).withDefault(
    (resolve: DesignTokenResolver) => {
        const fill = resolve(fillColor);
        const set: InteractiveSwatchSet = {
            rest: fill,
            hover: fill,
            active: fill,
            focus: fill,
            disabled: fill,
        }
        return resolve(blackOrWhiteDiscernibleRecipe).evaluate(resolve, set).rest!
    }
);

export const blackOrWhiteReadableRest = createTokenSwatch("color.blackOrWhite.readable.rest", StyleProperty.foregroundFill).withDefault(
    (resolve: DesignTokenResolver) => {
        const fill = resolve(fillColor);
        const set: InteractiveSwatchSet = {
            rest: fill,
            hover: fill,
            active: fill,
            focus: fill,
            disabled: fill,
        }
        return resolve(blackOrWhiteReadableRecipe).evaluate(resolve, set).rest!
    }
);
