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
