import { parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { Palette, Swatch, SwatchRGB } from "../color/index.js";
import { PaletteRGB } from "../color/palette-rgb.js";
import { create, createNonCss } from "./create.js";

/** @public */
export const neutralBaseColor = create<string>("neutral-base-color").withDefault("#808080");

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
export const accentBaseColor = create<string>("accent-base-color").withDefault("#88CC00");

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
