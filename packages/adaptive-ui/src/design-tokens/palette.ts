import { parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenType } from "../adaptive-design-tokens.js";
import { Palette, Swatch, SwatchRGB } from "../color/index.js";
import { PaletteRGB } from "../color/palette-rgb.js";
import { createNonCss, createTokenNonCss } from "../token-helpers.js";

/** @public */
export const neutralBaseColor = createTokenNonCss<string>("neutral-base-color", DesignTokenType.color).withDefault("#808080");

/** @public */
export const neutralBaseSwatch = createNonCss<Swatch>("neutral-base-swatch").withDefault(
    (resolve: DesignTokenResolver) => {
        const hex = resolve(neutralBaseColor);
        const rgb = parseColorHexRGB(hex);
        if (rgb === null) {
            throw new Error(`Unable to parse neutralBaseColor as hex string: ${hex}`);
        }
        return SwatchRGB.from(rgb);
    }
);

/** @public */
export const neutralPalette = createNonCss<Palette>("neutral-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteRGB.from(resolve(neutralBaseSwatch) as SwatchRGB)
);

/** @public */
export const accentBaseColor = createTokenNonCss<string>("accent-base-color", DesignTokenType.color).withDefault("#F26C0D");

/** @public */
export const accentBaseSwatch = createNonCss<Swatch>("accent-base-swatch").withDefault(
    (resolve: DesignTokenResolver) => {
        const hex = resolve(accentBaseColor);
        const rgb = parseColorHexRGB(hex);
        if (rgb === null) {
            throw new Error(`Unable to parse accentBaseColor as hex string: ${hex}`);
        }
        return SwatchRGB.from(rgb);
    }
);

/** @public */
export const accentPalette = createNonCss<Palette>("accent-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteRGB.from(resolve(accentBaseSwatch) as SwatchRGB)
);
