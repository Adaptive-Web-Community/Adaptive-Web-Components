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

/**
 * @deprecated Use the token `color.wcagContrast.level` of a library.
 * @public
 */
export const wcagContrastLevel = color.wcagContrast.level;

/**
 * @deprecated Use the token `color.wcagContrast.minContrast.safety` of a library.
 * @public
 */
export const minContrastSafety = color.wcagContrast.minContrast.safety;

/**
 * @deprecated Use the token `color.wcagContrast.minContrast.subtle` of a library.
 * @public
 */
export const minContrastSubtle = color.wcagContrast.minContrast.subtle;

/**
 * @deprecated Use the token `color.wcagContrast.minContrast.ideal` of a library.
 * @public
 */
export const minContrastIdeal = color.wcagContrast.minContrast.ideal;

/**
 * @deprecated Use the token `color.wcagContrast.minContrast.discernible` of a library.
 * @public
 */
export const minContrastDiscernible = color.wcagContrast.minContrast.discernible;

/**
 * @deprecated Use the token `color.wcagContrast.minContrast.readable` of a library.
 * @public
 */
export const minContrastReadable = color.wcagContrast.minContrast.readable;

/**
 * @deprecated Use the token `color.wcagContrast.minContrast.strong` of a library.
 * @public
 */
export const strokeStrongMinContrast = color.wcagContrast.minContrast.strong;

/**
 * @deprecated Use the token `color.neutral.asOverlay` of a library.
 * @public
 */
export const neutralAsOverlay = color.neutral.asOverlay;

/**
 * @deprecated Use the token `color.deltas.fill.stealth.rest` of a library.
 * @public
 */
export const fillStealthRestDelta = color.deltas.fill.stealth.rest;

/**
 * @deprecated Use the token `color.deltas.fill.stealth.hover` of a library.
 * @public
 */
export const fillStealthHoverDelta = color.deltas.fill.stealth.hover;

/**
 * @deprecated Use the token `color.deltas.fill.stealth.active` of a library.
 * @public
 */
export const fillStealthActiveDelta = color.deltas.fill.stealth.active;

/**
 * @deprecated Use the token `color.deltas.fill.stealth.focus` of a library.
 * @public
 */
export const fillStealthFocusDelta = color.deltas.fill.stealth.focus;

/**
 * @deprecated Use the token `color.deltas.fill.stealth.disabled` of a library.
 * @public
 */
export const fillStealthDisabledDelta = color.deltas.fill.stealth.disabled;

/**
 * @deprecated Use the token `color.deltas.fill.subtle.rest` of a library.
 * @public
 */
export const fillSubtleRestDelta = color.deltas.fill.subtle.rest;

/**
 * @deprecated Use the token `color.deltas.fill.subtle.hover` of a library.
 * @public
 */
export const fillSubtleHoverDelta = color.deltas.fill.subtle.hover;

/**
 * @deprecated Use the token `color.deltas.fill.subtle.active` of a library.
 * @public
 */
export const fillSubtleActiveDelta = color.deltas.fill.subtle.active;

/**
 * @deprecated Use the token `color.deltas.fill.subtle.focus` of a library.
 * @public
 */
export const fillSubtleFocusDelta = color.deltas.fill.subtle.focus;

/**
 * @deprecated Use the token `color.deltas.fill.subtle.disabled` of a library.
 * @public
 */
export const fillSubtleDisabledDelta = color.deltas.fill.subtle.disabled;

/**
 * @deprecated Use the token `color.deltas.fill.ideal.rest` of a library.
 * @public
 */
export const fillIdealRestDelta = color.deltas.fill.ideal.rest;

/**
 * @deprecated Use the token `color.deltas.fill.ideal.hover` of a library.
 * @public
 */
export const fillIdealHoverDelta = color.deltas.fill.ideal.hover;

/**
 * @deprecated Use the token `color.deltas.fill.ideal.active` of a library.
 * @public
 */
export const fillIdealActiveDelta = color.deltas.fill.ideal.active;

/**
 * @deprecated Use the token `color.deltas.fill.ideal.focus` of a library.
 * @public
 */
export const fillIdealFocusDelta = color.deltas.fill.ideal.focus;

/**
 * @deprecated Use the token `color.deltas.fill.ideal.disabled` of a library.
 * @public
 */
export const fillIdealDisabledDelta = color.deltas.fill.ideal.disabled;

/**
 * @deprecated Use the token `color.deltas.fill.discernible.rest` of a library.
 * @public
 */
export const fillDiscernibleRestDelta = color.deltas.fill.discernible.rest;

/**
 * @deprecated Use the token `color.deltas.fill.discernible.hover` of a library.
 * @public
 */
export const fillDiscernibleHoverDelta = color.deltas.fill.discernible.hover;

/**
 * @deprecated Use the token `color.deltas.fill.discernible.active` of a library.
 * @public
 */
export const fillDiscernibleActiveDelta = color.deltas.fill.discernible.active;

/**
 * @deprecated Use the token `color.deltas.fill.discernible.focus` of a library.
 * @public
 */
export const fillDiscernibleFocusDelta = color.deltas.fill.discernible.focus;

/**
 * @deprecated Use the token `color.deltas.fill.discernible.disabled` of a library.
 * @public
 */
export const fillDiscernibleDisabledDelta = color.deltas.fill.discernible.disabled;

/**
 * @deprecated Use the token `color.deltas.fill.readable.rest` of a library.
 * @public
 */
export const fillReadableRestDelta = color.deltas.fill.readable.rest;

/**
 * @deprecated Use the token `color.deltas.fill.readable.hover` of a library.
 * @public
 */
export const fillReadableHoverDelta = color.deltas.fill.readable.hover;

/**
 * @deprecated Use the token `color.deltas.fill.readable.active` of a library.
 * @public
 */
export const fillReadableActiveDelta = color.deltas.fill.readable.active;

/**
 * @deprecated Use the token `color.deltas.fill.readable.focus` of a library.
 * @public
 */
export const fillReadableFocusDelta = color.deltas.fill.readable.focus;

/**
 * @deprecated Use the token `color.deltas.fill.readable.disabled` of a library.
 * @public
 */
export const fillReadableDisabledDelta = color.deltas.fill.readable.disabled;

/**
 * @deprecated Use the token `color.deltas.stroke.safety.rest` of a library.
 * @public
 */
export const strokeSafetyRestDelta = color.deltas.stroke.safety.rest;

/**
 * @deprecated Use the token `color.deltas.stroke.safety.hover` of a library.
 * @public
 */
export const strokeSafetyHoverDelta = color.deltas.stroke.safety.hover;

/**
 * @deprecated Use the token `color.deltas.stroke.safety.active` of a library.
 * @public
 */
export const strokeSafetyActiveDelta = color.deltas.stroke.safety.active;

/**
 * @deprecated Use the token `color.deltas.stroke.safety.focus` of a library.
 * @public
 */
export const strokeSafetyFocusDelta = color.deltas.stroke.safety.focus;

/**
 * @deprecated Use the token `color.deltas.stroke.safety.disabled` of a library.
 * @public
 */
export const strokeSafetyDisabledDelta = color.deltas.stroke.safety.disabled;

/**
 * @deprecated Use the token `color.deltas.stroke.stealth.rest` of a library.
 * @public
 */
export const strokeStealthRestDelta = color.deltas.stroke.stealth.rest;

/**
 * @deprecated Use the token `color.deltas.stroke.stealth.hover` of a library.
 * @public
 */
export const strokeStealthHoverDelta = color.deltas.stroke.stealth.hover;

/**
 * @deprecated Use the token `color.deltas.stroke.stealth.active` of a library.
 * @public
 */
export const strokeStealthActiveDelta = color.deltas.stroke.stealth.active;

/**
 * @deprecated Use the token `color.deltas.stroke.stealth.focus` of a library.
 * @public
 */
export const strokeStealthFocusDelta = color.deltas.stroke.stealth.focus;

/**
 * @deprecated Use the token `color.deltas.stroke.stealth.disabled` of a library.
 * @public
 */
export const strokeStealthDisabledDelta = color.deltas.stroke.stealth.disabled;

/**
 * @deprecated Use the token `color.deltas.stroke.subtle.rest` of a library.
 * @public
 */
export const strokeSubtleRestDelta = color.deltas.stroke.subtle.rest;

/**
 * @deprecated Use the token `color.deltas.stroke.subtle.hover` of a library.
 * @public
 */
export const strokeSubtleHoverDelta = color.deltas.stroke.subtle.hover;

/**
 * @deprecated Use the token `color.deltas.stroke.subtle.active` of a library.
 * @public
 */
export const strokeSubtleActiveDelta = color.deltas.stroke.subtle.active;

/**
 * @deprecated Use the token `color.deltas.stroke.subtle.focus` of a library.
 * @public
 */
export const strokeSubtleFocusDelta = color.deltas.stroke.subtle.focus;

/**
 * @deprecated Use the token `color.deltas.stroke.subtle.disabled` of a library.
 * @public
 */
export const strokeSubtleDisabledDelta = color.deltas.stroke.subtle.disabled;

/**
 * @deprecated Use the token `color.deltas.stroke.discernible.rest` of a library.
 * @public
 */
export const strokeDiscernibleRestDelta = color.deltas.stroke.discernible.rest;

/**
 * @deprecated Use the token `color.deltas.stroke.discernible.hover` of a library.
 * @public
 */
export const strokeDiscernibleHoverDelta = color.deltas.stroke.discernible.hover;

/**
 * @deprecated Use the token `color.deltas.stroke.discernible.active` of a library.
 * @public
 */
export const strokeDiscernibleActiveDelta = color.deltas.stroke.discernible.active;

/**
 * @deprecated Use the token `color.deltas.stroke.discernible.focus` of a library.
 * @public
 */
export const strokeDiscernibleFocusDelta = color.deltas.stroke.discernible.focus;

/**
 * @deprecated Use the token `color.deltas.stroke.discernible.disabled` of a library.
 * @public
 */
export const strokeDiscernibleDisabledDelta = color.deltas.stroke.discernible.disabled;

/**
 * @deprecated Use the token `color.deltas.stroke.readable.rest` of a library.
 * @public
 */
export const strokeReadableRestDelta = color.deltas.stroke.readable.rest;

/**
 * @deprecated Use the token `color.deltas.stroke.readable.hover` of a library.
 * @public
 */
export const strokeReadableHoverDelta = color.deltas.stroke.readable.hover;

/**
 * @deprecated Use the token `color.deltas.stroke.readable.active` of a library.
 * @public
 */
export const strokeReadableActiveDelta = color.deltas.stroke.readable.active;

/**
 * @deprecated Use the token `color.deltas.stroke.readable.focus` of a library.
 * @public
 */
export const strokeReadableFocusDelta = color.deltas.stroke.readable.focus;

/**
 * @deprecated Use the token `color.deltas.stroke.readable.disabled` of a library.
 * @public
 */
export const strokeReadableDisabledDelta = color.deltas.stroke.readable.disabled;

/**
 * @deprecated Use the token `color.deltas.stroke.strong.rest` of a library.
 * @public
 */
export const strokeStrongRestDelta = color.deltas.stroke.strong.rest;

/**
 * @deprecated Use the token `color.deltas.stroke.strong.hover` of a library.
 * @public
 */
export const strokeStrongHoverDelta = color.deltas.stroke.strong.hover;

/**
 * @deprecated Use the token `color.deltas.stroke.strong.active` of a library.
 * @public
 */
export const strokeStrongActiveDelta = color.deltas.stroke.strong.active;

/**
 * @deprecated Use the token `color.deltas.stroke.strong.focus` of a library.
 * @public
 */
export const strokeStrongFocusDelta = color.deltas.stroke.strong.focus;

/**
 * @deprecated Use the token `color.deltas.stroke.strong.disabled` of a library.
 * @public
 */
export const strokeStrongDisabledDelta = color.deltas.stroke.strong.disabled;

/**
 * @deprecated Use the token `color.neutral.fill.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralFillStealth = color.neutral.fill.stealth;

/**
 * @deprecated Use the token `color.neutral.fill.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralFillSubtle = color.neutral.fill.subtle;

/**
 * @deprecated Use the token `color.neutral.fill.subtleInverse` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralFillSubtleInverse = color.neutral.fill.subtleInverse;

/**
 * @deprecated Use the token `color.neutral.fill.ideal` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralFillIdeal = color.neutral.fill.ideal;

/**
 * @deprecated Use the token `color.neutral.fill.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralFillDiscernible = color.neutral.fill.discernible;

/**
 * @deprecated Use the token `color.neutral.fill.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralFillReadable = color.neutral.fill.readable;

/**
 * @deprecated Use the token `color.neutral.stroke.safety` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralStrokeSafety = color.neutral.stroke.safety;

/**
 * @deprecated Use the token `color.neutral.stroke.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralStrokeStealth = color.neutral.stroke.stealth;

/**
 * @deprecated Use the token `color.neutral.stroke.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralStrokeSubtle = color.neutral.stroke.subtle;

/**
 * @deprecated Use the token `color.neutral.stroke.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralStrokeDiscernible = color.neutral.stroke.discernible;

/**
 * @deprecated Use the token `color.neutral.stroke.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralStrokeReadable = color.neutral.stroke.readable;

/**
 * @deprecated Use the token `color.neutral.stroke.strong` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const neutralStrokeStrong = color.neutral.stroke.strong;

/**
 * @deprecated Use the token `color.accent.fill.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentFillStealth = color.accent.fill.stealth;

/**
 * @deprecated Use the token `color.accent.fill.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentFillSubtle = color.accent.fill.subtle;

/**
 * @deprecated Use the token `color.accent.fill.subtleInverse` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentFillSubtleInverse = color.accent.fill.subtleInverse;

/**
 * @deprecated Use the token `color.accent.fill.ideal` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentFillIdeal = color.accent.fill.ideal;

/**
 * @deprecated Use the token `color.accent.fill.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentFillDiscernible = color.accent.fill.discernible;

/**
 * @deprecated Use the token `color.accent.fill.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentFillReadable = color.accent.fill.readable;

/**
 * @deprecated Use the token `color.accent.stroke.safety` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentStrokeSafety = color.accent.stroke.safety;

/**
 * @deprecated Use the token `color.accent.stroke.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentStrokeStealth = color.accent.stroke.stealth;

/**
 * @deprecated Use the token `color.accent.stroke.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentStrokeSubtle = color.accent.stroke.subtle;

/**
 * @deprecated Use the token `color.accent.stroke.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentStrokeDiscernible = color.accent.stroke.discernible;

/**
 * @deprecated Use the token `color.accent.stroke.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentStrokeReadable = color.accent.stroke.readable;

/**
 * @deprecated Use the token `color.accent.stroke.strong` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const accentStrokeStrong = color.accent.stroke.strong;

/**
 * @deprecated Use the token `color.highlight.fill.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightFillStealth = color.highlight.fill.stealth;

/**
 * @deprecated Use the token `color.highlight.fill.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightFillSubtle = color.highlight.fill.subtle;

/**
 * @deprecated Use the token `color.highlight.fill.subtleInverse` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightFillSubtleInverse = color.highlight.fill.subtleInverse;

/**
 * @deprecated Use the token `color.highlight.fill.ideal` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightFillIdeal = color.highlight.fill.ideal;

/**
 * @deprecated Use the token `color.highlight.fill.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightFillDiscernible = color.highlight.fill.discernible;

/**
 * @deprecated Use the token `color.highlight.fill.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightFillReadable = color.highlight.fill.readable;

/**
 * @deprecated Use the token `color.highlight.stroke.safety` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightStrokeSafety = color.highlight.stroke.safety;

/**
 * @deprecated Use the token `color.highlight.stroke.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightStrokeStealth = color.highlight.stroke.stealth;

/**
 * @deprecated Use the token `color.highlight.stroke.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightStrokeSubtle = color.highlight.stroke.subtle;

/**
 * @deprecated Use the token `color.highlight.stroke.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightStrokeDiscernible = color.highlight.stroke.discernible;

/**
 * @deprecated Use the token `color.highlight.stroke.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightStrokeReadable = color.highlight.stroke.readable;

/**
 * @deprecated Use the token `color.highlight.stroke.strong` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const highlightStrokeStrong = color.highlight.stroke.strong;

/**
 * @deprecated Use the token `color.critical.fill.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalFillStealth = color.critical.fill.stealth;

/**
 * @deprecated Use the token `color.critical.fill.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalFillSubtle = color.critical.fill.subtle;

/**
 * @deprecated Use the token `color.critical.fill.subtleInverse` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalFillSubtleInverse = color.critical.fill.subtleInverse;

/**
 * @deprecated Use the token `color.critical.fill.ideal` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalFillIdeal = color.critical.fill.ideal;

/**
 * @deprecated Use the token `color.critical.fill.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalFillDiscernible = color.critical.fill.discernible;

/**
 * @deprecated Use the token `color.critical.fill.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalFillReadable = color.critical.fill.readable;

/**
 * @deprecated Use the token `color.critical.stroke.safety` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalStrokeSafety = color.critical.stroke.safety;

/**
 * @deprecated Use the token `color.critical.stroke.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalStrokeStealth = color.critical.stroke.stealth;

/**
 * @deprecated Use the token `color.critical.stroke.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalStrokeSubtle = color.critical.stroke.subtle;

/**
 * @deprecated Use the token `color.critical.stroke.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalStrokeDiscernible = color.critical.stroke.discernible;

/**
 * @deprecated Use the token `color.critical.stroke.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalStrokeReadable = color.critical.stroke.readable;

/**
 * @deprecated Use the token `color.critical.stroke.strong` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const criticalStrokeStrong = color.critical.stroke.strong;

/**
 * @deprecated Use the token `color.warning.fill.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningFillStealth = color.warning.fill.stealth;

/**
 * @deprecated Use the token `color.warning.fill.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningFillSubtle = color.warning.fill.subtle;

/**
 * @deprecated Use the token `color.warning.fill.subtleInverse` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningFillSubtleInverse = color.warning.fill.subtleInverse;

/**
 * @deprecated Use the token `color.warning.fill.ideal` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningFillIdeal = color.warning.fill.ideal;

/**
 * @deprecated Use the token `color.warning.fill.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningFillDiscernible = color.warning.fill.discernible;

/**
 * @deprecated Use the token `color.warning.fill.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningFillReadable = color.warning.fill.readable;

/**
 * @deprecated Use the token `color.warning.stroke.safety` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningStrokeSafety = color.warning.stroke.safety;

/**
 * @deprecated Use the token `color.warning.stroke.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningStrokeStealth = color.warning.stroke.stealth;

/**
 * @deprecated Use the token `color.warning.stroke.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningStrokeSubtle = color.warning.stroke.subtle;

/**
 * @deprecated Use the token `color.warning.stroke.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningStrokeDiscernible = color.warning.stroke.discernible;

/**
 * @deprecated Use the token `color.warning.stroke.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningStrokeReadable = color.warning.stroke.readable;

/**
 * @deprecated Use the token `color.warning.stroke.strong` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const warningStrokeStrong = color.warning.stroke.strong;

/**
 * @deprecated Use the token `color.success.fill.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successFillStealth = color.success.fill.stealth;

/**
 * @deprecated Use the token `color.success.fill.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successFillSubtle = color.success.fill.subtle;

/**
 * @deprecated Use the token `color.success.fill.subtleInverse` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successFillSubtleInverse = color.success.fill.subtleInverse;

/**
 * @deprecated Use the token `color.success.fill.ideal` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successFillIdeal = color.success.fill.ideal;

/**
 * @deprecated Use the token `color.success.fill.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successFillDiscernible = color.success.fill.discernible;

/**
 * @deprecated Use the token `color.success.fill.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successFillReadable = color.success.fill.readable;

/**
 * @deprecated Use the token `color.success.stroke.safety` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successStrokeSafety = color.success.stroke.safety;

/**
 * @deprecated Use the token `color.success.stroke.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successStrokeStealth = color.success.stroke.stealth;

/**
 * @deprecated Use the token `color.success.stroke.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successStrokeSubtle = color.success.stroke.subtle;

/**
 * @deprecated Use the token `color.success.stroke.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successStrokeDiscernible = color.success.stroke.discernible;

/**
 * @deprecated Use the token `color.success.stroke.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successStrokeReadable = color.success.stroke.readable;

/**
 * @deprecated Use the token `color.success.stroke.strong` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const successStrokeStrong = color.success.stroke.strong;

/**
 * @deprecated Use the token `color.info.fill.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoFillStealth = color.info.fill.stealth;

/**
 * @deprecated Use the token `color.info.fill.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoFillSubtle = color.info.fill.subtle;

/**
 * @deprecated Use the token `color.info.fill.subtleInverse` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoFillSubtleInverse = color.info.fill.subtleInverse;

/**
 * @deprecated Use the token `color.info.fill.ideal` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoFillIdeal = color.info.fill.ideal;

/**
 * @deprecated Use the token `color.info.fill.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoFillDiscernible = color.info.fill.discernible;

/**
 * @deprecated Use the token `color.info.fill.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoFillReadable = color.info.fill.readable;

/**
 * @deprecated Use the token `color.info.stroke.safety` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoStrokeSafety = color.info.stroke.safety;

/**
 * @deprecated Use the token `color.info.stroke.stealth` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoStrokeStealth = color.info.stroke.stealth;

/**
 * @deprecated Use the token `color.info.stroke.subtle` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoStrokeSubtle = color.info.stroke.subtle;

/**
 * @deprecated Use the token `color.info.stroke.discernible` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoStrokeDiscernible = color.info.stroke.discernible;

/**
 * @deprecated Use the token `color.info.stroke.readable` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoStrokeReadable = color.info.stroke.readable;

/**
 * @deprecated Use the token `color.info.stroke.strong` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a state, so use the state of the value, or the property `--<name>-<state>` in CSS.
 * @public
 */
export const infoStrokeStrong = color.info.stroke.strong;

/**
 * @deprecated Use the token `color.focusStroke.palette` of a library.
 * @public
 */
export const focusStrokePalette = color.focusStroke.palette;

/**
 * @deprecated Use the token `color.focusStroke.minContrast` of a library.
 * @public
 */
export const focusStrokeMinContrast = color.focusStroke.minContrast;

/**
 * @deprecated Use the token `color.focusStroke.$root` of a library.
 * @public
 */
export const focusStroke = color.focusStroke.$root;

/**
 * @deprecated Use the token `color.focusStroke.outer` of a library.
 * @public
 */
export const focusStrokeOuter = color.focusStroke.outer;

/**
 * @deprecated Use the token `color.focusStroke.inner` of a library.
 * @public
 */
export const focusStrokeInner = color.focusStroke.inner;
