import {
    blackOrWhiteDiscernibleRecipe,
    blackOrWhiteReadableRecipe,
    ColorRecipe,
    contrastSwatch,
    createNonCss,
    createTokenNonCss,
    createTokenSwatch,
    DesignTokenType,
    fillColor,
    InteractiveSwatchSet,
    Palette,
    PaletteRGB,
    StyleProperty,
    Swatch,
} from "@adaptive-web/adaptive-ui";
import { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";

// Local recipes for use in documentation files.

export const docBaseColor = createTokenNonCss<string>("doc-base-color", DesignTokenType.color).withDefault("#E1477E");

export const docPalette = createNonCss<Palette>("doc-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteRGB.from(resolve(docBaseColor))
);

export const docForegroundRecipe = DesignToken.create<ColorRecipe>("doc-foreground-recipe").withDefault({
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        contrastSwatch(
            resolve(docPalette),
            reference || resolve(fillColor),
            4.5,
        ),
});

export const docForeground = createTokenSwatch("doc-foreground", [StyleProperty.borderFill, StyleProperty.foregroundFill]).withDefault(
    (resolve: DesignTokenResolver) => resolve(docForegroundRecipe).evaluate(resolve)
);

export const docFillRecipe = DesignToken.create<ColorRecipe>("doc-fill-recipe").withDefault({
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        contrastSwatch(
            resolve(docPalette),
            reference || resolve(fillColor),
            5,
        ),
});

export const docFill = createTokenSwatch("doc-fill", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) => resolve(docFillRecipe).evaluate(resolve)
);

// Placeholder tokens for `blackOrWhite` recipes, which have special handling in style modules.

export const blackOrWhiteDiscernibleRest = createTokenSwatch("black-or-white-discernible-rest", StyleProperty.foregroundFill).withDefault(
    (resolve: DesignTokenResolver) => {
        const fill = resolve(fillColor);
        const set: InteractiveSwatchSet = {
            rest: fill,
            hover: fill,
            active: fill,
            focus: fill,
        }
        return resolve(blackOrWhiteDiscernibleRecipe).evaluate(resolve, set).rest
    }
);

export const blackOrWhiteReadableRest = createTokenSwatch("black-or-white-readable-rest", StyleProperty.foregroundFill).withDefault(
    (resolve: DesignTokenResolver) => {
        const fill = resolve(fillColor);
        const set: InteractiveSwatchSet = {
            rest: fill,
            hover: fill,
            active: fill,
            focus: fill,
        }
        return resolve(blackOrWhiteReadableRecipe).evaluate(resolve, set).rest
    }
);
