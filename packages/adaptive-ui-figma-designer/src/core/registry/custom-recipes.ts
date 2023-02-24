import {
    ColorRecipe,
    contrastSwatch,
    fillColor,
    Palette,
    PaletteRGB,
    Swatch,
    SwatchRGB,
} from "@adaptive-web/adaptive-ui";
import { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { parseColorHexRGB } from "@microsoft/fast-colors";

// Local recipes for use in documentation files.

export const docBaseColor = DesignToken.create<Swatch>("doc-base-color").withDefault(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    SwatchRGB.from(parseColorHexRGB("#E1477E")!)
);

export const docPalette = DesignToken.create<Palette>("doc-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteRGB.from(resolve(docBaseColor) as SwatchRGB)
);

export const docForegroundRecipe = DesignToken.create<ColorRecipe>("doc-foreground-recipe").withDefault({
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        contrastSwatch(
            resolve(docPalette),
            reference || resolve(fillColor),
            4.5,
        ),
});

export const docForeground = DesignToken.create<Swatch>("doc-foreground").withDefault(
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

export const docFill = DesignToken.create<Swatch>("doc-fill").withDefault(
    (resolve: DesignTokenResolver) => resolve(docFillRecipe).evaluate(resolve)
);
