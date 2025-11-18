import { createTokenFontFamily, createTokenFontSize, createTokenFontStyle, createTokenFontWeight } from "../core/token-helpers.js";
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


/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const fontFamilyLegacy = createTokenFontFamily("typography.default.fontFamily").withDefault(fontFamily);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const bodyFontFamilyLegacy = createTokenFontFamily("typography.body.fontFamily").withDefault(bodyFontFamily);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const labelFontFamilyLegacy = createTokenFontFamily("typography.label.fontFamily").withDefault(labelFontFamily);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const fontWeightLegacy = createTokenFontWeight("typography.default.fontWeight").withDefault(fontWeight);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const bodyFontWeightLegacy = createTokenFontWeight("typography.body.fontWeight").withDefault(bodyFontWeight);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const labelFontWeightLegacy = createTokenFontWeight("typography.label.fontWeight").withDefault(labelFontWeight);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const fontStyleLegacy = createTokenFontStyle("typography.default.fontStyle").withDefault(fontStyle);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const bodyFontStyleLegacy = createTokenFontStyle("typography.body.fontStyle").withDefault(bodyFontStyle);

/** @deprecated Use the non-"Legacy" versions of the tokens instead. @public */
export const labelFontStyleLegacy = createTokenFontStyle("typography.label.fontStyle").withDefault(labelFontStyle);

/**
 * The complete type ramp with all positions from minus2 to plus6.
 *
 * @public
 */
export const typeRampDefault = new TypeRampTokenGroup(
    "typography.ramp.default",
    { fontSize: "10px", lineHeight: "12px", lineHeightMultiline: "14px" }, // minus2
    { fontSize: "12px", lineHeight: "14px", lineHeightMultiline: "16px" }, // minus1
    { fontSize: "14px", lineHeight: "16px", lineHeightMultiline: "18px" }, // base
    { fontSize: "16px", lineHeight: "22px", lineHeightMultiline: "24px" }, // plus1
    { fontSize: "20px", lineHeight: "26px", lineHeightMultiline: "28px" }, // plus2
    { fontSize: "24px", lineHeight: "32px", lineHeightMultiline: "34px" }, // plus3
    { fontSize: "28px", lineHeight: "36px", lineHeightMultiline: "38px" }, // plus4
    { fontSize: "32px", lineHeight: "40px", lineHeightMultiline: "42px" }, // plus5
    { fontSize: "40px", lineHeight: "52px", lineHeightMultiline: "56px" }  // plus6
);

/**
 * Example: Create a type scale from a base size and multiplier.
 * A type scale generates all positions using a consistent multiplier and line height ratio.
 * The base.fontSize is the primary editable token, and all other positions
 * derive from it using calc() expressions with the multiplier.
 *
 * @example
 * ```ts
 * import { TypeScaleTokenGroup } from "../core/typography/type-ramp.js";
 * 
 * // Create a type scale with 1.25 ratio
 * export const typeRampScale = new TypeScaleTokenGroup(
 *     "typography.ramp.scale",
 *     "16px",  // base size
 *     1.2,     // multiplier (each step is 1.2x the previous)
 *     1.3,     // line height ratio for single-line UI (optional, defaults to 1.3)
 *     1.6,     // line height ratio for multiline text (optional, defaults to 1.6)
 *     "2px",   // line height snap for rounding (optional, defaults to "2px")
 * );
 * 
 * // Access the scale:
 * // typeRampScale.base.fontSize - the primary editable base font size token
 * // typeRampScale.base.lineHeight - for single-line UI elements
 * // typeRampScale.base.lineHeightMultiline - for multiline text
 * // typeRampScale.multiplier - the multiplier token (also editable)
 * // typeRampScale.plus1.fontSize - derived: "calc(base * multiplier)"
 * // typeRampScale.plus2.fontSize - derived: "calc(base * pow(multiplier, 2))"
 * // typeRampScale.minus1.fontSize - derived: "calc(base / multiplier)"
 * ```
 */

// Export individual tokens for backward compatibility

/** @deprecated Use `typeRampDefault.minus2.fontSize` directly. @public */
export const typeRampMinus2FontSize = createTokenFontSize("typography.ramp.minus2.fontSize").withDefault(typeRampDefault.minus2.fontSize);

/** @deprecated Use `typeRampDefault.minus2.lineHeight` directly. @public */
export const typeRampMinus2LineHeight = createTokenFontSize("typography.ramp.minus2.lineHeight").withDefault(typeRampDefault.minus2.lineHeight);

/** @deprecated Use `typeRampDefault.minus2.fontVariations` directly. @public */
export const typeRampMinus2FontVariations = createTokenFontSize("typography.ramp.minus2.fontVariations").withDefault(typeRampDefault.minus2.fontVariations);

/** @deprecated Use `typeRampDefault.minus1.fontSize` directly. @public */
export const typeRampMinus1FontSize = createTokenFontSize("typography.ramp.minus1.fontSize").withDefault(typeRampDefault.minus1.fontSize);

/** @deprecated Use `typeRampDefault.minus1.lineHeight` directly. @public */
export const typeRampMinus1LineHeight = createTokenFontSize("typography.ramp.minus1.lineHeight").withDefault(typeRampDefault.minus1.lineHeight);

/** @deprecated Use `typeRampDefault.minus1.fontVariations` directly. @public */
export const typeRampMinus1FontVariations = createTokenFontSize("typography.ramp.minus1.fontVariations").withDefault(typeRampDefault.minus1.fontVariations);

/** @deprecated Use `typeRampDefault.base.fontSize` directly. @public */
export const typeRampBaseFontSize = createTokenFontSize("typography.ramp.base.fontSize").withDefault(typeRampDefault.base.fontSize);

/** @deprecated Use `typeRampDefault.base.lineHeight` directly. @public */
export const typeRampBaseLineHeight = createTokenFontSize("typography.ramp.base.lineHeight").withDefault(typeRampDefault.base.lineHeight);

/** @deprecated Use `typeRampDefault.base.fontVariations` directly. @public */
export const typeRampBaseFontVariations = createTokenFontSize("typography.ramp.base.fontVariations").withDefault(typeRampDefault.base.fontVariations);

/** @deprecated Use `typeRampDefault.plus1.fontSize` directly. @public */
export const typeRampPlus1FontSize = createTokenFontSize("typography.ramp.plus1.fontSize").withDefault(typeRampDefault.plus1.fontSize);

/** @deprecated Use `typeRampDefault.plus1.lineHeight` directly. @public */
export const typeRampPlus1LineHeight = createTokenFontSize("typography.ramp.plus1.lineHeight").withDefault(typeRampDefault.plus1.lineHeight);

/** @deprecated Use `typeRampDefault.plus1.fontVariations` directly. @public */
export const typeRampPlus1FontVariations = createTokenFontSize("typography.ramp.plus1.fontVariations").withDefault(typeRampDefault.plus1.fontVariations);

/** @deprecated Use `typeRampDefault.plus2.fontSize` directly. @public */
export const typeRampPlus2FontSize = createTokenFontSize("typography.ramp.plus2.fontSize").withDefault(typeRampDefault.plus2.fontSize);

/** @deprecated Use `typeRampDefault.plus2.lineHeight` directly. @public */
export const typeRampPlus2LineHeight = createTokenFontSize("typography.ramp.plus2.lineHeight").withDefault(typeRampDefault.plus2.lineHeight);

/** @deprecated Use `typeRampDefault.plus2.fontVariations` directly. @public */
export const typeRampPlus2FontVariations = createTokenFontSize("typography.ramp.plus2.fontVariations").withDefault(typeRampDefault.plus2.fontVariations);

/** @deprecated Use `typeRampDefault.plus3.fontSize` directly. @public */
export const typeRampPlus3FontSize = createTokenFontSize("typography.ramp.plus3.fontSize").withDefault(typeRampDefault.plus3.fontSize);

/** @deprecated Use `typeRampDefault.plus3.lineHeight` directly. @public */
export const typeRampPlus3LineHeight = createTokenFontSize("typography.ramp.plus3.lineHeight").withDefault(typeRampDefault.plus3.lineHeight);

/** @deprecated Use `typeRampDefault.plus3.fontVariations` directly. @public */
export const typeRampPlus3FontVariations = createTokenFontSize("typography.ramp.plus3.fontVariations").withDefault(typeRampDefault.plus3.fontVariations);

/** @deprecated Use `typeRampDefault.plus4.fontSize` directly. @public */
export const typeRampPlus4FontSize = createTokenFontSize("typography.ramp.plus4.fontSize").withDefault(typeRampDefault.plus4.fontSize);

/** @deprecated Use `typeRampDefault.plus4.lineHeight` directly. @public */
export const typeRampPlus4LineHeight = createTokenFontSize("typography.ramp.plus4.lineHeight").withDefault(typeRampDefault.plus4.lineHeight);

/** @deprecated Use `typeRampDefault.plus4.fontVariations` directly. @public */
export const typeRampPlus4FontVariations = createTokenFontSize("typography.ramp.plus4.fontVariations").withDefault(typeRampDefault.plus4.fontVariations);

/** @deprecated Use `typeRampDefault.plus5.fontSize` directly. @public */
export const typeRampPlus5FontSize = createTokenFontSize("typography.ramp.plus5.fontSize").withDefault(typeRampDefault.plus5.fontSize);

/** @deprecated Use `typeRampDefault.plus5.lineHeight` directly. @public */
export const typeRampPlus5LineHeight = createTokenFontSize("typography.ramp.plus5.lineHeight").withDefault(typeRampDefault.plus5.lineHeight);

/** @deprecated Use `typeRampDefault.plus5.fontVariations` directly. @public */
export const typeRampPlus5FontVariations = createTokenFontSize("typography.ramp.plus5.fontVariations").withDefault(typeRampDefault.plus5.fontVariations);

/** @deprecated Use `typeRampDefault.plus6.fontSize` directly. @public */
export const typeRampPlus6FontSize = createTokenFontSize("typography.ramp.plus6.fontSize").withDefault(typeRampDefault.plus6.fontSize);

/** @deprecated Use `typeRampDefault.plus6.lineHeight` directly. @public */
export const typeRampPlus6LineHeight = createTokenFontSize("typography.ramp.plus6.lineHeight").withDefault(typeRampDefault.plus6.lineHeight);

/** @deprecated Use `typeRampDefault.plus6.fontVariations` directly. @public */
export const typeRampPlus6FontVariations = createTokenFontSize("typography.ramp.plus6.fontVariations").withDefault(typeRampDefault.plus6.fontVariations);
