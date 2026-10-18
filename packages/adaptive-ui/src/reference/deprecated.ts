/**
 * The names of the design tokens that Adaptive UI exported before, each one is the token of the same name in the library.
 *
 * @remarks
 * Everything here is deprecated and will be removed before 1.0. A token is not an instance of a class anymore, so it
 * doesn't have `withDefault`, `getValueFor`, or `setValueFor`, see MIGRATION.md. The name of the token in the library is
 * the same as the name it had. Why: `docs/decisions/0002-deprecated-names-for-the-beta.md`.
 */
import { Library } from "design-token-library";
import { color as colorConfig, ColorLibraryTokens } from "./color.js";
import { typography, TypographyLibraryTokens } from "./typography.js";

// The library for the tokens that are exported here. Each system that is migrated adds its configuration to this.
const library = Library.create<TypographyLibraryTokens & ColorLibraryTokens>({
    typography,
    color: colorConfig,
});

const { color } = library.tokens;

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

/**
 * @deprecated Use the token `color.neutral.base` of a library.
 * @public
 */
export const neutralBaseColor = color.neutral.base;

/**
 * @deprecated Use the token `color.neutral.palette` of a library.
 * @public
 */
export const neutralPalette = color.neutral.palette;

/**
 * @deprecated Use the token `color.accent.base` of a library.
 * @public
 */
export const accentBaseColor = color.accent.base;

/**
 * @deprecated Use the token `color.accent.palette` of a library.
 * @public
 */
export const accentPalette = color.accent.palette;

/**
 * @deprecated Use the token `color.highlight.base` of a library.
 * @public
 */
export const highlightBaseColor = color.highlight.base;

/**
 * @deprecated Use the token `color.highlight.palette` of a library.
 * @public
 */
export const highlightPalette = color.highlight.palette;

/**
 * @deprecated Use the token `color.critical.base` of a library.
 * @public
 */
export const criticalBaseColor = color.critical.base;

/**
 * @deprecated Use the token `color.critical.palette` of a library.
 * @public
 */
export const criticalPalette = color.critical.palette;

/**
 * @deprecated Use the token `color.warning.base` of a library.
 * @public
 */
export const warningBaseColor = color.warning.base;

/**
 * @deprecated Use the token `color.warning.palette` of a library.
 * @public
 */
export const warningPalette = color.warning.palette;

/**
 * @deprecated Use the token `color.success.base` of a library.
 * @public
 */
export const successBaseColor = color.success.base;

/**
 * @deprecated Use the token `color.success.palette` of a library.
 * @public
 */
export const successPalette = color.success.palette;

/**
 * @deprecated Use the token `color.info.base` of a library.
 * @public
 */
export const infoBaseColor = color.info.base;

/**
 * @deprecated Use the token `color.info.palette` of a library.
 * @public
 */
export const infoPalette = color.info.palette;

/**
 * @deprecated Use the token `color.disabled.palette` of a library.
 * @public
 */
export const disabledPalette = color.disabled.palette;

/**
 * @deprecated Use the token `color.context` of a library.
 * @public
 */
export const colorContext = color.context;

/**
 * @deprecated Use the token `color.layer.palette` of a library.
 * @public
 */
export const layerPalette = color.layer.palette;

/**
 * @deprecated Use the token `color.layer.fill.ramp.baseLuminance` of a library.
 * @public
 */
export const layerFillBaseLuminance = color.layer.fill.ramp.baseLuminance;

/**
 * @deprecated Use the token `color.layer.fill.restDelta` of a library.
 * @public
 */
export const layerFillRestDelta = color.layer.fill.restDelta;

/**
 * @deprecated Use the token `color.layer.fill.interactiveDeltas.hover` of a library.
 * @public
 */
export const layerFillHoverDelta = color.layer.fill.interactiveDeltas.hover;

/**
 * @deprecated Use the token `color.layer.fill.interactiveDeltas.active` of a library.
 * @public
 */
export const layerFillActiveDelta = color.layer.fill.interactiveDeltas.active;

/**
 * @deprecated Use the token `color.layer.fill.interactiveDeltas.focus` of a library.
 * @public
 */
export const layerFillFocusDelta = color.layer.fill.interactiveDeltas.focus;

/**
 * @deprecated Use the token `color.layer.fill.interactiveDeltas.disabled` of a library.
 * @public
 */
export const layerFillDisabledDelta = color.layer.fill.interactiveDeltas.disabled;

/**
 * The fill of an interactive layer, a set of the states.
 *
 * @deprecated Use the token `color.layer.fill.interactive` of a library, whose value is `{ rest, hover, active, focus, disabled }`.
 * There is no token for a state, like `layerFillInteractiveRest`, so use the state of the value, or `--color-layer-fill-interactive-<state>` in CSS.
 * @public
 */
export const layerFillInteractive = color.layer.fill.interactive;

/**
 * @deprecated Use the token `color.layer.fill.ramp.base` of a library.
 * @public
 */
export const layerFillFixedBase = color.layer.fill.ramp.base;

/**
 * @deprecated Use the token `color.layer.fill.ramp.minus1` of a library.
 * @public
 */
export const layerFillFixedMinus1 = color.layer.fill.ramp.minus1;

/**
 * @deprecated Use the token `color.layer.fill.ramp.minus2` of a library.
 * @public
 */
export const layerFillFixedMinus2 = color.layer.fill.ramp.minus2;

/**
 * @deprecated Use the token `color.layer.fill.ramp.minus3` of a library.
 * @public
 */
export const layerFillFixedMinus3 = color.layer.fill.ramp.minus3;

/**
 * @deprecated Use the token `color.layer.fill.ramp.minus4` of a library.
 * @public
 */
export const layerFillFixedMinus4 = color.layer.fill.ramp.minus4;

/**
 * @deprecated Use the token `color.layer.fill.ramp.plus1` of a library.
 * @public
 */
export const layerFillFixedPlus1 = color.layer.fill.ramp.plus1;

/**
 * @deprecated Use the token `color.layer.fill.ramp.plus2` of a library.
 * @public
 */
export const layerFillFixedPlus2 = color.layer.fill.ramp.plus2;

/**
 * @deprecated Use the token `color.layer.fill.ramp.plus3` of a library.
 * @public
 */
export const layerFillFixedPlus3 = color.layer.fill.ramp.plus3;

/**
 * @deprecated Use the token `color.layer.fill.ramp.plus4` of a library.
 * @public
 */
export const layerFillFixedPlus4 = color.layer.fill.ramp.plus4;
