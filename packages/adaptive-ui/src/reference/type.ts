import { createTokenFontFamily, createTokenFontStyle, createTokenFontWeight } from "../core/token-helpers.js";
import { TypeRampTokenGroup } from "../core/typography/type-ramp.js";

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
export const fontFamily = createTokenFontFamily("typography.fontFamily.default").withDefault("Arial, Helvetica, sans-serif");

/** @public */
export const bodyFontFamily = createTokenFontFamily("typography.fontFamily.body").withDefault(fontFamily);

/** @public */
export const labelFontFamily = createTokenFontFamily("typography.fontFamily.label").withDefault(fontFamily);

/** @public */
export const fontWeight = createTokenFontWeight("typography.fontWeight.default").withDefault(StandardFontWeight.Normal);

/** @public */
export const bodyFontWeight = createTokenFontWeight("typography.fontWeight.body").withDefault(fontWeight);

/** @public */
export const labelFontWeight = createTokenFontWeight("typography.fontWeight.label").withDefault(fontWeight);

/** @public */
export const fontStyle = createTokenFontStyle("typography.fontStyle.default").withDefault("normal");

/** @public */
export const bodyFontStyle = createTokenFontStyle("typography.fontStyle.body").withDefault(fontStyle);

/** @public */
export const labelFontStyle = createTokenFontStyle("typography.fontStyle.label").withDefault(fontStyle);

/**
 * The complete type ramp with all positions from minus2 to plus6.
 *
 * @public
 */
export const typeRampDefault = new TypeRampTokenGroup(
    "typography.ramp.default",
    "10px",
    "12px",
    "12px",
    "14px",
    "14px",
    "16px",
    "16px",
    "22px",
    "20px",
    "26px",
    "24px",
    "32px",
    "28px",
    "36px",
    "32px",
    "40px",
    "40px",
    "52px"
);

// Export individual tokens for backward compatibility

/** @public */
export const typeRampMinus2FontSize = typeRampDefault.minus2.fontSize;

/** @public */
export const typeRampMinus2LineHeight = typeRampDefault.minus2.lineHeight;

/** @public */
export const typeRampMinus2FontVariations = typeRampDefault.minus2.fontVariations;

/** @public */
export const typeRampMinus1FontSize = typeRampDefault.minus1.fontSize;

/** @public */
export const typeRampMinus1LineHeight = typeRampDefault.minus1.lineHeight;

/** @public */
export const typeRampMinus1FontVariations = typeRampDefault.minus1.fontVariations;

/** @public */
export const typeRampBaseFontSize = typeRampDefault.base.fontSize;

/** @public */
export const typeRampBaseLineHeight = typeRampDefault.base.lineHeight;

/** @public */
export const typeRampBaseFontVariations = typeRampDefault.base.fontVariations;

/** @public */
export const typeRampPlus1FontSize = typeRampDefault.plus1.fontSize;

/** @public */
export const typeRampPlus1LineHeight = typeRampDefault.plus1.lineHeight;

/** @public */
export const typeRampPlus1FontVariations = typeRampDefault.plus1.fontVariations;

/** @public */
export const typeRampPlus2FontSize = typeRampDefault.plus2.fontSize;

/** @public */
export const typeRampPlus2LineHeight = typeRampDefault.plus2.lineHeight;

/** @public */
export const typeRampPlus2FontVariations = typeRampDefault.plus2.fontVariations;

/** @public */
export const typeRampPlus3FontSize = typeRampDefault.plus3.fontSize;

/** @public */
export const typeRampPlus3LineHeight = typeRampDefault.plus3.lineHeight;

/** @public */
export const typeRampPlus3FontVariations = typeRampDefault.plus3.fontVariations;

/** @public */
export const typeRampPlus4FontSize = typeRampDefault.plus4.fontSize;

/** @public */
export const typeRampPlus4LineHeight = typeRampDefault.plus4.lineHeight;

/** @public */
export const typeRampPlus4FontVariations = typeRampDefault.plus4.fontVariations;

/** @public */
export const typeRampPlus5FontSize = typeRampDefault.plus5.fontSize;

/** @public */
export const typeRampPlus5LineHeight = typeRampDefault.plus5.lineHeight;

/** @public */
export const typeRampPlus5FontVariations = typeRampDefault.plus5.fontVariations;

/** @public */
export const typeRampPlus6FontSize = typeRampDefault.plus6.fontSize;

/** @public */
export const typeRampPlus6LineHeight = typeRampDefault.plus6.lineHeight;

/** @public */
export const typeRampPlus6FontVariations = typeRampDefault.plus6.fontVariations;