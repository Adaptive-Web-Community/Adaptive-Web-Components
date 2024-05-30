import type { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import {
    createTokenFontFamily,
    createTokenFontSize,
    createTokenFontStyle,
    createTokenFontVariations,
    createTokenFontWeight,
    createTokenLineHeight
} from "../core/token-helpers.js";

/**
 * Standard font weights.
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
export const fontFamily = createTokenFontFamily("typography.default.fontFamily").withDefault('Arial, Helvetica, sans-serif');

/** @public */
export const bodyFontFamily = createTokenFontFamily("typography.body.fontFamily").withDefault(fontFamily);

/** @public */
export const labelFontFamily = createTokenFontFamily("typography.label.fontFamily").withDefault(fontFamily);

/** @public */
export const fontWeight = createTokenFontWeight("typography.default.fontWeight").withDefault(StandardFontWeight.Normal);

/** @public */
export const bodyFontWeight = createTokenFontWeight("typography.body.fontWeight").withDefault(fontWeight);

/** @public */
export const labelFontWeight = createTokenFontWeight("typography.label.fontWeight").withDefault(fontWeight);

/** @public */
export const fontStyle = createTokenFontStyle("typography.default.fontStyle").withDefault("normal");

/** @public */
export const bodyFontStyle = createTokenFontStyle("typography.body.fontStyle").withDefault(fontStyle);

/** @public */
export const labelFontStyle = createTokenFontStyle("typography.label.fontStyle").withDefault(fontStyle);

// TODO: This should be a recipe. Reevaluate as design tokens update.
function fontVariations(sizeToken: DesignToken<string>): (resolve: DesignTokenResolver) => string {
    return (resolve: DesignTokenResolver): string => {
        return "";
    };
}

/** @public */
export const typeRampBaseFontSize = createTokenFontSize("typography.ramp.base.fontSize").withDefault("14px");

/** @public */
export const typeRampBaseLineHeight = createTokenLineHeight("typography.ramp.base.lineHeight").withDefault("16px");

/** @public */
export const typeRampBaseFontVariations = createTokenFontVariations("typography.ramp.base.fontVariations").withDefault(
    fontVariations(typeRampBaseFontSize)
);

/** @public */
export const typeRampMinus1FontSize = createTokenFontSize("typography.ramp.minus1.fontSize").withDefault("12px");

/** @public */
export const typeRampMinus1LineHeight = createTokenLineHeight("typography.ramp.minus1.lineHeight").withDefault("14px");

/** @public */
export const typeRampMinus1FontVariations = createTokenFontVariations("typography.ramp.minus1.fontVariations").withDefault(
    fontVariations(typeRampMinus1FontSize)
);

/** @public */
export const typeRampMinus2FontSize = createTokenFontSize("typography.ramp.minus2.fontSize").withDefault("10px");

/** @public */
export const typeRampMinus2LineHeight = createTokenLineHeight("typography.ramp.minus2.lineHeight").withDefault("12px");

/** @public */
export const typeRampMinus2FontVariations = createTokenFontVariations("typography.ramp.minus2.fontVariations").withDefault(
    fontVariations(typeRampMinus2FontSize)
);

/** @public */
export const typeRampPlus1FontSize = createTokenFontSize("typography.ramp.plus1.fontSize").withDefault("16px");

/** @public */
export const typeRampPlus1LineHeight = createTokenLineHeight("typography.ramp.plus1.lineHeight").withDefault("22px");

/** @public */
export const typeRampPlus1FontVariations = createTokenFontVariations("typography.ramp.plus1.fontVariations").withDefault(
    fontVariations(typeRampPlus1FontSize)
);

/** @public */
export const typeRampPlus2FontSize = createTokenFontSize("typography.ramp.plus2.fontSize").withDefault("20px");

/** @public */
export const typeRampPlus2LineHeight = createTokenLineHeight("typography.ramp.plus2.lineHeight").withDefault("26px");

/** @public */
export const typeRampPlus2FontVariations = createTokenFontVariations("typography.ramp.plus2.fontVariations").withDefault(
    fontVariations(typeRampPlus2FontSize)
);

/** @public */
export const typeRampPlus3FontSize = createTokenFontSize("typography.ramp.plus3.fontSize").withDefault("24px");

/** @public */
export const typeRampPlus3LineHeight = createTokenLineHeight("typography.ramp.plus3.lineHeight").withDefault("32px");

/** @public */
export const typeRampPlus3FontVariations = createTokenFontVariations("typography.ramp.plus3.fontVariations").withDefault(
    fontVariations(typeRampPlus3FontSize)
);

/** @public */
export const typeRampPlus4FontSize = createTokenFontSize("typography.ramp.plus4.fontSize").withDefault("28px");

/** @public */
export const typeRampPlus4LineHeight = createTokenLineHeight("typography.ramp.plus4.lineHeight").withDefault("36px");

/** @public */
export const typeRampPlus4FontVariations = createTokenFontVariations("typography.ramp.plus4.fontVariations").withDefault(
    fontVariations(typeRampPlus4FontSize)
);

/** @public */
export const typeRampPlus5FontSize = createTokenFontSize("typography.ramp.plus5.fontSize").withDefault("32px");

/** @public */
export const typeRampPlus5LineHeight = createTokenLineHeight("typography.ramp.plus5.lineHeight").withDefault("40px");

/** @public */
export const typeRampPlus5FontVariations = createTokenFontVariations("typography.ramp.plus5.fontVariations").withDefault(
    fontVariations(typeRampPlus5FontSize)
);

/** @public */
export const typeRampPlus6FontSize = createTokenFontSize("typography.ramp.plus6.fontSize").withDefault("40px");

/** @public */
export const typeRampPlus6LineHeight = createTokenLineHeight("typography.ramp.plus6.lineHeight").withDefault("52px");

/** @public */
export const typeRampPlus6FontVariations = createTokenFontVariations("typography.ramp.plus6.fontVariations").withDefault(
    fontVariations(typeRampPlus6FontSize)
);
