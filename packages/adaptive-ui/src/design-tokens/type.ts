import type { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import {
    createTokenFontFamily,
    createTokenFontSize,
    createTokenFontVariations,
    createTokenFontWeight,
    createTokenLineHeight
} from "../token-helpers.js";

/**
 * Standard font wights.
 *
 * @public
 */
export const StandardFontWeight = {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    Normal: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    Black: 900,
} as const;

/** @public */
export const fontFamily = createTokenFontFamily("font-family").withDefault('Arial, Helvetica, sans-serif');

/** @public */
export const bodyFontFamily = createTokenFontFamily("body-font-family").withDefault(fontFamily);

/** @public */
export const labelFontFamily = createTokenFontFamily("label-font-family").withDefault(fontFamily);

/** @public */
export const fontWeight = createTokenFontWeight("font-weight").withDefault(StandardFontWeight.Normal);

/** @public */
export const bodyFontWeight = createTokenFontWeight("body-font-weight").withDefault(fontWeight);

/** @public */
export const labelFontWeight = createTokenFontWeight("label-font-weight").withDefault(fontWeight);

function fontVariations(sizeToken: DesignToken<string>): (resolve: DesignTokenResolver) => string {
    return (resolve: DesignTokenResolver): string => {
        return "";
    };
}

/** @public */
export const typeRampBaseFontSize = createTokenFontSize("type-ramp-base-font-size").withDefault("14px");

/** @public */
export const typeRampBaseLineHeight = createTokenLineHeight("type-ramp-base-line-height").withDefault("16px");

/** @public */
export const typeRampBaseFontVariations = createTokenFontVariations("type-ramp-base-font-variations").withDefault(
    fontVariations(typeRampBaseFontSize)
);

/** @public */
export const typeRampMinus1FontSize = createTokenFontSize("type-ramp-minus-1-font-size").withDefault("12px");

/** @public */
export const typeRampMinus1LineHeight = createTokenLineHeight("type-ramp-minus-1-line-height").withDefault("14px");

/** @public */
export const typeRampMinus1FontVariations = createTokenFontVariations("type-ramp-minus-1-font-variations").withDefault(
    fontVariations(typeRampMinus1FontSize)
);

/** @public */
export const typeRampMinus2FontSize = createTokenFontSize("type-ramp-minus-2-font-size").withDefault("10px");

/** @public */
export const typeRampMinus2LineHeight = createTokenLineHeight("type-ramp-minus-2-line-height").withDefault("12px");

/** @public */
export const typeRampMinus2FontVariations = createTokenFontVariations("type-ramp-minus-2-font-variations").withDefault(
    fontVariations(typeRampMinus2FontSize)
);

/** @public */
export const typeRampPlus1FontSize = createTokenFontSize("type-ramp-plus-1-font-size").withDefault("16px");

/** @public */
export const typeRampPlus1LineHeight = createTokenLineHeight("type-ramp-plus-1-line-height").withDefault("22px");

/** @public */
export const typeRampPlus1FontVariations = createTokenFontVariations("type-ramp-plus-1-font-variations").withDefault(
    fontVariations(typeRampPlus1FontSize)
);

/** @public */
export const typeRampPlus2FontSize = createTokenFontSize("type-ramp-plus-2-font-size").withDefault("20px");

/** @public */
export const typeRampPlus2LineHeight = createTokenLineHeight("type-ramp-plus-2-line-height").withDefault("26px");

/** @public */
export const typeRampPlus2FontVariations = createTokenFontVariations("type-ramp-plus-2-font-variations").withDefault(
    fontVariations(typeRampPlus2FontSize)
);

/** @public */
export const typeRampPlus3FontSize = createTokenFontSize("type-ramp-plus-3-font-size").withDefault("24px");

/** @public */
export const typeRampPlus3LineHeight = createTokenLineHeight("type-ramp-plus-3-line-height").withDefault("32px");

/** @public */
export const typeRampPlus3FontVariations = createTokenFontVariations("type-ramp-plus-3-font-variations").withDefault(
    fontVariations(typeRampPlus3FontSize)
);

/** @public */
export const typeRampPlus4FontSize = createTokenFontSize("type-ramp-plus-4-font-size").withDefault("28px");

/** @public */
export const typeRampPlus4LineHeight = createTokenLineHeight("type-ramp-plus-4-line-height").withDefault("36px");

/** @public */
export const typeRampPlus4FontVariations = createTokenFontVariations("type-ramp-plus-4-font-variations").withDefault(
    fontVariations(typeRampPlus4FontSize)
);

/** @public */
export const typeRampPlus5FontSize = createTokenFontSize("type-ramp-plus-5-font-size").withDefault("32px");

/** @public */
export const typeRampPlus5LineHeight = createTokenLineHeight("type-ramp-plus-5-line-height").withDefault("40px");

/** @public */
export const typeRampPlus5FontVariations = createTokenFontVariations("type-ramp-plus-5-font-variations").withDefault(
    fontVariations(typeRampPlus5FontSize)
);

/** @public */
export const typeRampPlus6FontSize = createTokenFontSize("type-ramp-plus-6-font-size").withDefault("40px");

/** @public */
export const typeRampPlus6LineHeight = createTokenLineHeight("type-ramp-plus-6-line-height").withDefault("52px");

/** @public */
export const typeRampPlus6FontVariations = createTokenFontVariations("type-ramp-plus-6-font-variations").withDefault(
    fontVariations(typeRampPlus6FontSize)
);
