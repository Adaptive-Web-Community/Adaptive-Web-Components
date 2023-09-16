import type { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenType } from "../adaptive-design-tokens.js";
import { Palette, PaletteOkhsl } from "../color/index.js";
import { createNonCss, createTokenNonCss } from "../token-helpers.js";

/** @public */
export const neutralBaseColor = createTokenNonCss<string>("neutral-base-color", DesignTokenType.color).withDefault("#808080");

/** @public */
export const neutralPalette = createNonCss<Palette>("neutral-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(neutralBaseColor))
);

/** @public */
export const accentBaseColor = createTokenNonCss<string>("accent-base-color", DesignTokenType.color).withDefault("#F26C0D");

/** @public */
export const accentPalette = createNonCss<Palette>("accent-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(accentBaseColor))
);

/** @public */
export const highlightBaseColor = createTokenNonCss<string>("highlight-base-color", DesignTokenType.color).withDefault("#0DA1F2");

/** @public */
export const highlightPalette = createNonCss<Palette>("highlight-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(highlightBaseColor))
);

/** @public */
export const destructiveBaseColor = createTokenNonCss<string>("destructive-base-color", DesignTokenType.color).withDefault("#D92635");

/** @public */
export const destructivePalette = createNonCss<Palette>("destructive-palette").withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(destructiveBaseColor))
);
