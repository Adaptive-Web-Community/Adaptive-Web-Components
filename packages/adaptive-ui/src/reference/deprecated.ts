/**
 * The names of the design tokens that Adaptive UI exported before, each one is the token of the same name in the library.
 *
 * @remarks
 * Everything here is deprecated and will be removed before 1.0. A token is not an instance of a class anymore, so it
 * doesn't have `withDefault`, `getValueFor`, or `setValueFor`, see MIGRATION.md. The name of the token in the library is
 * the same as the name it had. Why: `docs/decisions/0002-deprecated-names-for-the-beta.md`.
 */
import { Library } from "design-token-library";
import { typography, TypographyLibraryTokens } from "./typography.js";

// The library for the tokens that are exported here. Each system that is migrated adds its configuration to this.
const library = Library.create<TypographyLibraryTokens>({ typography });

const { fontFamily: fontFamilies, fontWeight: fontWeights, fontStyle: fontStyles, ramp } = library.tokens.typography;

/**
 * Standard font weights.
 *
 * @deprecated Use a number, or a keyword of a DTCG font weight, like `"normal"` or `"bold"`.
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

/**
 * @deprecated Use the token `typography.fontFamily.default` of a library.
 * @public
 */
export const fontFamily = fontFamilies.default;

/**
 * @deprecated Use the token `typography.fontFamily.body` of a library.
 * @public
 */
export const bodyFontFamily = fontFamilies.body;

/**
 * @deprecated Use the token `typography.fontFamily.label` of a library.
 * @public
 */
export const labelFontFamily = fontFamilies.label;

/**
 * @deprecated Use the token `typography.fontWeight.default` of a library.
 * @public
 */
export const fontWeight = fontWeights.default;

/**
 * @deprecated Use the token `typography.fontWeight.body` of a library.
 * @public
 */
export const bodyFontWeight = fontWeights.body;

/**
 * @deprecated Use the token `typography.fontWeight.label` of a library.
 * @public
 */
export const labelFontWeight = fontWeights.label;

/**
 * @deprecated Use the token `typography.fontStyle.default` of a library.
 * @public
 */
export const fontStyle = fontStyles.default;

/**
 * @deprecated Use the token `typography.fontStyle.body` of a library.
 * @public
 */
export const bodyFontStyle = fontStyles.body;

/**
 * @deprecated Use the token `typography.fontStyle.label` of a library.
 * @public
 */
export const labelFontStyle = fontStyles.label;

/**
 * The complete type ramp with all positions from minus2 to plus6.
 *
 * @deprecated Use the tokens `typography.ramp.default` of a library. The tokens of a position are the position of each
 * property now, `typeRampDefault.fontSize.base`, and not `typeRampDefault.base.fontSize`.
 * @public
 */
export const typeRampDefault = ramp.default;
