import type { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenType } from "../adaptive-design-tokens.js";
import { Palette, PaletteOkhsl } from "../color/index.js";
import { createTokenNonCss } from "../token-helpers.js";

/** @public */
export const neutralBaseColor = createTokenNonCss<string>("neutral-base-color", DesignTokenType.color).withDefault("#808080");

/** @public */
export const neutralPalette = createTokenNonCss<Palette>("neutral-palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(neutralBaseColor))
);

/** @public */
export const accentBaseColor = createTokenNonCss<string>("accent-base-color", DesignTokenType.color).withDefault("#F26C0D");

/** @public */
export const accentPalette = createTokenNonCss<Palette>("accent-palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(accentBaseColor))
);

/** @public */
export const highlightBaseColor = createTokenNonCss<string>("highlight-base-color", DesignTokenType.color).withDefault("#0DA1F2");

/** @public */
export const highlightPalette = createTokenNonCss<Palette>("highlight-palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(highlightBaseColor))
);

/** @public */
export const criticalBaseColor = createTokenNonCss<string>("critical-base-color", DesignTokenType.color).withDefault("#D92635");

/** @public */
export const criticalPalette = createTokenNonCss<Palette>("critical-palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(criticalBaseColor))
);

/** @public */
export const warningBaseColor = createTokenNonCss<string>("warning-base-color", DesignTokenType.color).withDefault("#D526D9");

/** @public */
export const warningPalette = createTokenNonCss<Palette>("warning-palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(warningBaseColor))
);

/** @public */
export const successBaseColor = createTokenNonCss<string>("success-base-color", DesignTokenType.color).withDefault("#6AD926");

/** @public */
export const successPalette = createTokenNonCss<Palette>("success-palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(successBaseColor))
);

/**
 * The {@link Palette} to use for disabled state.
 *
 * @remarks
 * By default this maps to the {@link neutralPalette}.
 * Use a custom palette like `disabledPalette.withDefault(PaletteOkhsl.from("#[HEX_COLOR]"))`.
 *
 * @public
 */
export const disabledPalette = createTokenNonCss<Palette>("disabled-palette", DesignTokenType.palette).withDefault(neutralPalette);
