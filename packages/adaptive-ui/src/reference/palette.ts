import type { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenType } from "../core/adaptive-design-tokens.js";
import { Palette, PaletteOkhsl } from "../core/color/index.js";
import { createTokenNonCss } from "../core/token-helpers.js";

/** @public */
export const neutralBaseColor = createTokenNonCss<string>("color.neutral.base", DesignTokenType.color).withDefault("#808080");

/** @public */
export const neutralPalette = createTokenNonCss<Palette>("color.neutral.palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(neutralBaseColor))
);

/** @public */
export const accentBaseColor = createTokenNonCss<string>("color.accent.base", DesignTokenType.color).withDefault("#F26C0D");

/** @public */
export const accentPalette = createTokenNonCss<Palette>("color.accent.palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(accentBaseColor))
);

/** @public */
export const highlightBaseColor = createTokenNonCss<string>("color.highlight.base", DesignTokenType.color).withDefault("#0DA1F2");

/** @public */
export const highlightPalette = createTokenNonCss<Palette>("color.highlight.palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(highlightBaseColor))
);

/** @public */
export const criticalBaseColor = createTokenNonCss<string>("color.critical.base", DesignTokenType.color).withDefault("#D92635");

/** @public */
export const criticalPalette = createTokenNonCss<Palette>("color.critical.palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(criticalBaseColor))
);

/** @public */
export const warningBaseColor = createTokenNonCss<string>("color.warning.base", DesignTokenType.color).withDefault("#D526D9");

/** @public */
export const warningPalette = createTokenNonCss<Palette>("color.warning.palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(warningBaseColor))
);

/** @public */
export const successBaseColor = createTokenNonCss<string>("color.success.base", DesignTokenType.color).withDefault("#6AD926");

/** @public */
export const successPalette = createTokenNonCss<Palette>("color.success.palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(successBaseColor))
);

/** @public */
export const infoBaseColor = createTokenNonCss<string>("color.info.base", DesignTokenType.color).withDefault("#0DA1F2");

/** @public */
export const infoPalette = createTokenNonCss<Palette>("color.info.palette", DesignTokenType.palette).withDefault(
    (resolve: DesignTokenResolver) =>
        PaletteOkhsl.from(resolve(infoBaseColor))
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
export const disabledPalette = createTokenNonCss<Palette>("color.disabled.palette", DesignTokenType.palette).withDefault(neutralPalette);
