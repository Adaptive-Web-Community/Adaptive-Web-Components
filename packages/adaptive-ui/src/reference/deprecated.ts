/**
 * The names of the design tokens that Adaptive UI exported before, each one is the token of the same name in the library.
 *
 * @remarks
 * Everything here is deprecated and will be removed before 1.0. A token is not an instance of a class anymore, so it
 * doesn't have `withDefault`, `getValueFor`, or `setValueFor`, see MIGRATION.md. The name of the token in the library is
 * the same as the name it had. Why: `docs/decisions/0002-deprecated-names-for-the-beta.md`.
 */
import { treatmentAt } from "../core/styles/treatment-token.js";
import { createReferenceLibrary } from "./library.js";

// The library for the tokens that are exported here, the reference system.
const library = createReferenceLibrary();

const { color, elevation, global, shape, density: densities } = library.tokens;

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

/**
 * @deprecated Use the token `elevation.card.$root` of a library, whose value is `{ rest, hover, active, focus, disabled }`. There is no token for a
 * state, like `elevationCardRest`, so use the state of the value, or `--elevation-card-<state>` in CSS.
 * @public
 */
export const elevationCardInteractive = elevation.card.$root;

/**
 * @deprecated Use the token `elevation.card.deltas.rest` of a library.
 * @public
 */
export const elevationCardRestSize = elevation.card.deltas.rest;

/**
 * @deprecated Use the token `elevation.card.deltas.hover` of a library.
 * @public
 */
export const elevationCardHoverSize = elevation.card.deltas.hover;

/**
 * @deprecated Use the token `elevation.card.deltas.active` of a library.
 * @public
 */
export const elevationCardActiveSize = elevation.card.deltas.active;

/**
 * @deprecated Use the token `elevation.card.deltas.focus` of a library.
 * @public
 */
export const elevationCardFocusSize = elevation.card.deltas.focus;

/**
 * @deprecated Use the token `elevation.card.deltas.disabled` of a library.
 * @public
 */
export const elevationCardDisabledSize = elevation.card.deltas.disabled;

/**
 * @deprecated Use the token `elevation.tooltip.$root` of a library.
 * @public
 */
export const elevationTooltip = elevation.tooltip.$root;

/**
 * @deprecated Use the token `elevation.tooltip.size` of a library.
 * @public
 */
export const elevationTooltipSize = elevation.tooltip.size;

/**
 * @deprecated Use the token `elevation.flyout.$root` of a library.
 * @public
 */
export const elevationFlyout = elevation.flyout.$root;

/**
 * @deprecated Use the token `elevation.flyout.size` of a library.
 * @public
 */
export const elevationFlyoutSize = elevation.flyout.size;

/**
 * @deprecated Use the token `elevation.dialog.$root` of a library.
 * @public
 */
export const elevationDialog = elevation.dialog.$root;

/**
 * @deprecated Use the token `elevation.dialog.size` of a library.
 * @public
 */
export const elevationDialogSize = elevation.dialog.size;

/**
 * @deprecated Use the token `global.designUnit` of a library.
 * @public
 */
export const designUnit = global.designUnit;

/**
 * @deprecated Use the token `shape.cornerRadius.default` of a library.
 * @public
 */
export const cornerRadiusControl = shape.cornerRadius.default;

/**
 * @deprecated Use the token `shape.cornerRadius.layer` of a library.
 * @public
 */
export const cornerRadiusLayer = shape.cornerRadius.layer;

/**
 * @deprecated Use the token `shape.strokeThickness.default` of a library.
 * @public
 */
export const strokeThickness = shape.strokeThickness.default;

/**
 * @deprecated Use the token `shape.strokeThickness.focus` of a library.
 * @public
 */
export const focusStrokeThickness = shape.strokeThickness.focus;

/**
 * @deprecated Use the token `density.adjustmentUnits` of a library.
 * @public
 */
export const densityAdjustmentUnits = densities.adjustmentUnits;

// The tokens of a density set, with the names of the properties of DensityPaddingAndGapTokenGroup.
const densityPaddingAndGap = (set: Pick<typeof densities.control, "designUnit" | "borderThickness" | "horizontal" | "vertical">) => ({
    designUnit: set.designUnit,
    borderThickness: set.borderThickness,
    horizontalPaddingUnits: set.horizontal.paddingUnits,
    horizontalPadding: set.horizontal.padding,
    horizontalGapUnits: set.horizontal.gapUnits,
    horizontalGap: set.horizontal.gap,
    verticalPaddingUnits: set.vertical.paddingUnits,
    verticalPadding: set.vertical.padding,
    verticalGapUnits: set.vertical.gapUnits,
    verticalGap: set.vertical.gap,
});

/**
 * @deprecated Use the tokens `density.text` of a library, where `horizontalPadding` is `horizontal.padding`. There is no `padding`.
 * @public
 */
export const densityText = densityPaddingAndGap(densities.text);

/**
 * @deprecated Use the tokens `density.control` of a library, where `horizontalPadding` is `horizontal.padding`. There is no `padding`.
 * @public
 */
export const densityControl = densityPaddingAndGap(densities.control);

/**
 * @deprecated Use the tokens `density.controlList` of a library, where `horizontalPadding` is `horizontal.padding`. There is no `padding`.
 * @public
 */
export const densityControlList = densityPaddingAndGap(densities.controlList);

/**
 * @deprecated Use the tokens `density.layer` of a library, where `horizontalPadding` is `horizontal.padding`. There is no `padding`.
 * @public
 */
export const densityLayer = densityPaddingAndGap(densities.layer);

/**
 * @deprecated Use the token `color.gradient.angle` of a library.
 * @beta
 */
export const gradientAngle = color.gradient.angle;

/**
 * @deprecated Use the token `color.gradient.startShift` of a library.
 * @beta
 */
export const gradientStartShift = color.gradient.startShift;

/**
 * @deprecated Use the token `color.gradient.endShift` of a library.
 * @beta
 */
export const gradientEndShift = color.gradient.endShift;

/**
 * @deprecated Use the token `color.accentHueShiftGradient.fill.subtle` of a library, a `paint` token.
 * @beta
 */
export const accentHueShiftGradientFillSubtleRest = color.accentHueShiftGradient.fill.subtle;

/**
 * @deprecated Use the token `color.accentToHighlightGradient.fill.subtle` of a library, a `paint` token.
 * @beta
 */
export const accentToHighlightGradientFillSubtleRest = color.accentToHighlightGradient.fill.subtle;

/**
 * @deprecated Use the treatment `color.accent.treatments.hueShiftGradientFillSubtleElement` of a library.
 * @public
 */
export const accentHueShiftGradientFillSubtleElementStyles = treatmentAt(library, "color.accent.treatments.hueShiftGradientFillSubtleElement");

/**
 * @deprecated Use the treatment `color.accent.treatments.toHighlightGradientFillSubtleElement` of a library.
 * @public
 */
export const accentToHighlightGradientFillSubtleElementStyles = treatmentAt(library, "color.accent.treatments.toHighlightGradientFillSubtleElement");

/**
 * @deprecated Use the treatment `shape.treatments.control` of a library.
 * @public
 */
export const controlShapeStyles = treatmentAt(library, "shape.treatments.control");

/**
 * @deprecated Use the treatment `shape.treatments.layer` of a library.
 * @public
 */
export const layerShapeStyles = treatmentAt(library, "shape.treatments.layer");

/**
 * @deprecated Use the treatment `shape.treatments.round` of a library.
 * @public
 */
export const roundShapeStyles = treatmentAt(library, "shape.treatments.round");

/**
 * @deprecated Use the treatment `density.text.treatment` of a library.
 * @public
 */
export const textDensityStyles = treatmentAt(library, "density.text.treatment");

/**
 * @deprecated Use the treatment `density.control.treatment` of a library.
 * @public
 */
export const controlDensityStyles = treatmentAt(library, "density.control.treatment");

/**
 * @deprecated Use the treatment `density.control.treatment.square` of a library.
 * @public
 */
export const controlSquareDensityStyles = treatmentAt(library, "density.control.treatment.square");

/**
 * @deprecated Use the treatment `density.control.treatment.autofillOuter` of a library.
 * @public
 */
export const autofillOuterDensityStyles = treatmentAt(library, "density.control.treatment.autofillOuter");

/**
 * @deprecated Use the treatment `density.control.treatment.autofillInner` of a library.
 * @public
 */
export const autofillInnerDensityStyles = treatmentAt(library, "density.control.treatment.autofillInner");

/**
 * @deprecated Use the treatment `density.controlList.treatment` of a library.
 * @public
 */
export const controlListDensityStyles = treatmentAt(library, "density.controlList.treatment");

/**
 * @deprecated Use the treatment `density.layer.treatment` of a library.
 * @public
 */
export const layerDensityStyles = treatmentAt(library, "density.layer.treatment");

/**
 * @deprecated Use the treatment `color.accent.treatments.fillStealthControl` of a library.
 * @public
 */
export const accentFillStealthControlStyles = treatmentAt(library, "color.accent.treatments.fillStealthControl");

/**
 * @deprecated Use the treatment `color.accent.treatments.fillSubtleControl` of a library.
 * @public
 */
export const accentFillSubtleControlStyles = treatmentAt(library, "color.accent.treatments.fillSubtleControl");

/**
 * @deprecated Use the treatment `color.accent.treatments.fillSubtleInverseControl` of a library.
 * @public
 */
export const accentFillSubtleInverseControlStyles = treatmentAt(library, "color.accent.treatments.fillSubtleInverseControl");

/**
 * @deprecated Use the treatment `color.accent.treatments.fillIdealControl` of a library.
 * @public
 */
export const accentFillIdealControlStyles = treatmentAt(library, "color.accent.treatments.fillIdealControl");

/**
 * @deprecated Use the treatment `color.accent.treatments.fillDiscernibleControl` of a library.
 * @public
 */
export const accentFillDiscernibleControlStyles = treatmentAt(library, "color.accent.treatments.fillDiscernibleControl");

/**
 * @deprecated Use the treatment `color.accent.treatments.fillReadableControl` of a library.
 * @public
 */
export const accentFillReadableControlStyles = treatmentAt(library, "color.accent.treatments.fillReadableControl");

/**
 * @deprecated Use the treatment `color.accent.treatments.outlineDiscernibleControl` of a library.
 * @public
 */
export const accentOutlineDiscernibleControlStyles = treatmentAt(library, "color.accent.treatments.outlineDiscernibleControl");

/**
 * @deprecated Use the treatment `color.accent.treatments.foregroundReadableControl` of a library.
 * @public
 */
export const accentForegroundReadableControlStyles = treatmentAt(library, "color.accent.treatments.foregroundReadableControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.fillStealthControl` of a library.
 * @public
 */
export const highlightFillStealthControlStyles = treatmentAt(library, "color.highlight.treatments.fillStealthControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.fillSubtleControl` of a library.
 * @public
 */
export const highlightFillSubtleControlStyles = treatmentAt(library, "color.highlight.treatments.fillSubtleControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.fillSubtleInverseControl` of a library.
 * @public
 */
export const highlightFillSubtleInverseControlStyles = treatmentAt(library, "color.highlight.treatments.fillSubtleInverseControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.fillIdealControl` of a library.
 * @public
 */
export const highlightFillIdealControlStyles = treatmentAt(library, "color.highlight.treatments.fillIdealControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.fillDiscernibleControl` of a library.
 * @public
 */
export const highlightFillDiscernibleControlStyles = treatmentAt(library, "color.highlight.treatments.fillDiscernibleControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.fillReadableControl` of a library.
 * @public
 */
export const highlightFillReadableControlStyles = treatmentAt(library, "color.highlight.treatments.fillReadableControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.outlineDiscernibleControl` of a library.
 * @public
 */
export const highlightOutlineDiscernibleControlStyles = treatmentAt(library, "color.highlight.treatments.outlineDiscernibleControl");

/**
 * @deprecated Use the treatment `color.highlight.treatments.foregroundReadableControl` of a library.
 * @public
 */
export const highlightForegroundReadableControlStyles = treatmentAt(library, "color.highlight.treatments.foregroundReadableControl");

/**
 * @deprecated Use the treatment `color.info.treatments.fillStealthControl` of a library.
 * @public
 */
export const infoFillStealthControlStyles = treatmentAt(library, "color.info.treatments.fillStealthControl");

/**
 * @deprecated Use the treatment `color.info.treatments.fillSubtleControl` of a library.
 * @public
 */
export const infoFillSubtleControlStyles = treatmentAt(library, "color.info.treatments.fillSubtleControl");

/**
 * @deprecated Use the treatment `color.info.treatments.fillSubtleInverseControl` of a library.
 * @public
 */
export const infoFillSubtleInverseControlStyles = treatmentAt(library, "color.info.treatments.fillSubtleInverseControl");

/**
 * @deprecated Use the treatment `color.info.treatments.fillIdealControl` of a library.
 * @public
 */
export const infoFillIdealControlStyles = treatmentAt(library, "color.info.treatments.fillIdealControl");

/**
 * @deprecated Use the treatment `color.info.treatments.fillDiscernibleControl` of a library.
 * @public
 */
export const infoFillDiscernibleControlStyles = treatmentAt(library, "color.info.treatments.fillDiscernibleControl");

/**
 * @deprecated Use the treatment `color.info.treatments.fillReadableControl` of a library.
 * @public
 */
export const infoFillReadableControlStyles = treatmentAt(library, "color.info.treatments.fillReadableControl");

/**
 * @deprecated Use the treatment `color.info.treatments.outlineDiscernibleControl` of a library.
 * @public
 */
export const infoOutlineDiscernibleControlStyles = treatmentAt(library, "color.info.treatments.outlineDiscernibleControl");

/**
 * @deprecated Use the treatment `color.info.treatments.foregroundReadableControl` of a library.
 * @public
 */
export const infoForegroundReadableControlStyles = treatmentAt(library, "color.info.treatments.foregroundReadableControl");

/**
 * @deprecated Use the treatment `color.success.treatments.fillStealthControl` of a library.
 * @public
 */
export const successFillStealthControlStyles = treatmentAt(library, "color.success.treatments.fillStealthControl");

/**
 * @deprecated Use the treatment `color.success.treatments.fillSubtleControl` of a library.
 * @public
 */
export const successFillSubtleControlStyles = treatmentAt(library, "color.success.treatments.fillSubtleControl");

/**
 * @deprecated Use the treatment `color.success.treatments.fillSubtleInverseControl` of a library.
 * @public
 */
export const successFillSubtleInverseControlStyles = treatmentAt(library, "color.success.treatments.fillSubtleInverseControl");

/**
 * @deprecated Use the treatment `color.success.treatments.fillIdealControl` of a library.
 * @public
 */
export const successFillIdealControlStyles = treatmentAt(library, "color.success.treatments.fillIdealControl");

/**
 * @deprecated Use the treatment `color.success.treatments.fillDiscernibleControl` of a library.
 * @public
 */
export const successFillDiscernibleControlStyles = treatmentAt(library, "color.success.treatments.fillDiscernibleControl");

/**
 * @deprecated Use the treatment `color.success.treatments.fillReadableControl` of a library.
 * @public
 */
export const successFillReadableControlStyles = treatmentAt(library, "color.success.treatments.fillReadableControl");

/**
 * @deprecated Use the treatment `color.success.treatments.outlineDiscernibleControl` of a library.
 * @public
 */
export const successOutlineDiscernibleControlStyles = treatmentAt(library, "color.success.treatments.outlineDiscernibleControl");

/**
 * @deprecated Use the treatment `color.success.treatments.foregroundReadableControl` of a library.
 * @public
 */
export const successForegroundReadableControlStyles = treatmentAt(library, "color.success.treatments.foregroundReadableControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.fillStealthControl` of a library.
 * @public
 */
export const warningFillStealthControlStyles = treatmentAt(library, "color.warning.treatments.fillStealthControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.fillSubtleControl` of a library.
 * @public
 */
export const warningFillSubtleControlStyles = treatmentAt(library, "color.warning.treatments.fillSubtleControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.fillSubtleInverseControl` of a library.
 * @public
 */
export const warningFillSubtleInverseControlStyles = treatmentAt(library, "color.warning.treatments.fillSubtleInverseControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.fillIdealControl` of a library.
 * @public
 */
export const warningFillIdealControlStyles = treatmentAt(library, "color.warning.treatments.fillIdealControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.fillDiscernibleControl` of a library.
 * @public
 */
export const warningFillDiscernibleControlStyles = treatmentAt(library, "color.warning.treatments.fillDiscernibleControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.fillReadableControl` of a library.
 * @public
 */
export const warningFillReadableControlStyles = treatmentAt(library, "color.warning.treatments.fillReadableControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.outlineDiscernibleControl` of a library.
 * @public
 */
export const warningOutlineDiscernibleControlStyles = treatmentAt(library, "color.warning.treatments.outlineDiscernibleControl");

/**
 * @deprecated Use the treatment `color.warning.treatments.foregroundReadableControl` of a library.
 * @public
 */
export const warningForegroundReadableControlStyles = treatmentAt(library, "color.warning.treatments.foregroundReadableControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.fillStealthControl` of a library.
 * @public
 */
export const criticalFillStealthControlStyles = treatmentAt(library, "color.critical.treatments.fillStealthControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.fillSubtleControl` of a library.
 * @public
 */
export const criticalFillSubtleControlStyles = treatmentAt(library, "color.critical.treatments.fillSubtleControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.fillSubtleInverseControl` of a library.
 * @public
 */
export const criticalFillSubtleInverseControlStyles = treatmentAt(library, "color.critical.treatments.fillSubtleInverseControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.fillIdealControl` of a library.
 * @public
 */
export const criticalFillIdealControlStyles = treatmentAt(library, "color.critical.treatments.fillIdealControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.fillDiscernibleControl` of a library.
 * @public
 */
export const criticalFillDiscernibleControlStyles = treatmentAt(library, "color.critical.treatments.fillDiscernibleControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.fillReadableControl` of a library.
 * @public
 */
export const criticalFillReadableControlStyles = treatmentAt(library, "color.critical.treatments.fillReadableControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.outlineDiscernibleControl` of a library.
 * @public
 */
export const criticalOutlineDiscernibleControlStyles = treatmentAt(library, "color.critical.treatments.outlineDiscernibleControl");

/**
 * @deprecated Use the treatment `color.critical.treatments.foregroundReadableControl` of a library.
 * @public
 */
export const criticalForegroundReadableControlStyles = treatmentAt(library, "color.critical.treatments.foregroundReadableControl");

/**
 * @deprecated Use the treatment `color.layer.treatments.fillInteractiveControl` of a library.
 * @public
 */
export const layerFillInteractiveControlStyles = treatmentAt(library, "color.layer.treatments.fillInteractiveControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.fillStealthControl` of a library.
 * @public
 */
export const neutralFillStealthControlStyles = treatmentAt(library, "color.neutral.treatments.fillStealthControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.fillSubtleControl` of a library.
 * @public
 */
export const neutralFillSubtleControlStyles = treatmentAt(library, "color.neutral.treatments.fillSubtleControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.fillSubtleInverseControl` of a library.
 * @public
 */
export const neutralFillSubtleInverseControlStyles = treatmentAt(library, "color.neutral.treatments.fillSubtleInverseControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.fillIdealControl` of a library.
 * @public
 */
export const neutralFillIdealControlStyles = treatmentAt(library, "color.neutral.treatments.fillIdealControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.fillDiscernibleControl` of a library.
 * @public
 */
export const neutralFillDiscernibleControlStyles = treatmentAt(library, "color.neutral.treatments.fillDiscernibleControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.fillReadableControl` of a library.
 * @public
 */
export const neutralFillReadableControlStyles = treatmentAt(library, "color.neutral.treatments.fillReadableControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.outlineDiscernibleControl` of a library.
 * @public
 */
export const neutralOutlineDiscernibleControlStyles = treatmentAt(library, "color.neutral.treatments.outlineDiscernibleControl");

/**
 * @deprecated Use the treatment `color.neutral.treatments.foregroundReadableElement` of a library.
 * @public
 */
export const neutralForegroundReadableElementStyles = treatmentAt(library, "color.neutral.treatments.foregroundReadableElement");

/**
 * @deprecated Use the treatment `color.neutral.treatments.foregroundStrongElement` of a library.
 * @public
 */
export const neutralForegroundStrongElementStyles = treatmentAt(library, "color.neutral.treatments.foregroundStrongElement");

/**
 * @deprecated Use the treatment `color.neutral.treatments.dividerSubtleElement` of a library.
 * @public
 */
export const neutralDividerSubtleElementStyles = treatmentAt(library, "color.neutral.treatments.dividerSubtleElement");

/**
 * @deprecated Use the treatment `color.neutral.treatments.dividerDiscernibleElement` of a library.
 * @public
 */
export const neutralDividerDiscernibleElementStyles = treatmentAt(library, "color.neutral.treatments.dividerDiscernibleElement");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.base` of a library.
 * @public
 */
export const typeRampBaseStyles = treatmentAt(library, "typography.ramp.default.treatments.base");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.minus1` of a library.
 * @public
 */
export const typeRampMinus1Styles = treatmentAt(library, "typography.ramp.default.treatments.minus1");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.minus2` of a library.
 * @public
 */
export const typeRampMinus2Styles = treatmentAt(library, "typography.ramp.default.treatments.minus2");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.plus1` of a library.
 * @public
 */
export const typeRampPlus1Styles = treatmentAt(library, "typography.ramp.default.treatments.plus1");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.plus2` of a library.
 * @public
 */
export const typeRampPlus2Styles = treatmentAt(library, "typography.ramp.default.treatments.plus2");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.plus3` of a library.
 * @public
 */
export const typeRampPlus3Styles = treatmentAt(library, "typography.ramp.default.treatments.plus3");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.plus4` of a library.
 * @public
 */
export const typeRampPlus4Styles = treatmentAt(library, "typography.ramp.default.treatments.plus4");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.plus5` of a library.
 * @public
 */
export const typeRampPlus5Styles = treatmentAt(library, "typography.ramp.default.treatments.plus5");

/**
 * @deprecated Use the treatment `typography.ramp.default.treatments.plus6` of a library.
 * @public
 */
export const typeRampPlus6Styles = treatmentAt(library, "typography.ramp.default.treatments.plus6");

/**
 * @deprecated Use the treatment `elevation.card.treatment` of a library.
 * @public
 */
export const shadowCardStyles = treatmentAt(library, "elevation.card.treatment");

/**
 * @deprecated Use the treatment `elevation.card.treatment.interactive` of a library.
 * @public
 */
export const shadowCardInteractiveStyles = treatmentAt(library, "elevation.card.treatment.interactive");

/**
 * @deprecated Use the treatment `elevation.tooltip.treatment` of a library.
 * @public
 */
export const shadowTooltipStyles = treatmentAt(library, "elevation.tooltip.treatment");

/**
 * @deprecated Use the treatment `elevation.flyout.treatment` of a library.
 * @public
 */
export const shadowFlyoutStyles = treatmentAt(library, "elevation.flyout.treatment");

/**
 * @deprecated Use the treatment `elevation.dialog.treatment` of a library.
 * @public
 */
export const shadowDialogStyles = treatmentAt(library, "elevation.dialog.treatment");

/**
 * @deprecated Use the treatment `treatments.actionControl` of a library.
 * @public
 */
export const actionStyles = treatmentAt(library, "treatments.actionControl");

/**
 * @deprecated Use the treatment `treatments.inputBase` of a library.
 * @public
 */
export const inputBaseStyles = treatmentAt(library, "treatments.inputBase");

/**
 * @deprecated Use the treatment `treatments.inputControl` of a library.
 * @public
 */
export const inputStyles = treatmentAt(library, "treatments.inputControl");

/**
 * @deprecated Use the treatment `treatments.inputAutofillControl` of a library.
 * @public
 */
export const inputAutofillStyles = treatmentAt(library, "treatments.inputAutofillControl");

/**
 * @deprecated Use the treatment `treatments.selectableControlSelected` of a library.
 * @public
 */
export const selectableSelectedStyles = treatmentAt(library, "treatments.selectableControlSelected");

/**
 * @deprecated Use the treatment `treatments.selectableControlUnselected` of a library.
 * @public
 */
export const selectableUnselectedStyles = treatmentAt(library, "treatments.selectableControlUnselected");

/**
 * @deprecated Use the treatment `treatments.itemControl` of a library.
 * @public
 */
export const itemStyles = treatmentAt(library, "treatments.itemControl");

/**
 * @deprecated Use the treatment `treatments.textPlain` of a library.
 * @public
 */
export const plainTextStyles = treatmentAt(library, "treatments.textPlain");

/**
 * @deprecated Use the treatment `treatments.textPlainMultiline` of a library.
 * @public
 */
export const plainTextMultilineStyles = treatmentAt(library, "treatments.textPlainMultiline");

/**
 * @deprecated Use the treatment `treatments.textLabel` of a library.
 * @public
 */
export const labelTextStyles = treatmentAt(library, "treatments.textLabel");

/**
 * @deprecated Use the treatment `treatments.flyout` of a library.
 * @public
 */
export const flyoutStyles = treatmentAt(library, "treatments.flyout");

/**
 * @deprecated Use the treatment `treatments.disabled` of a library.
 * @public
 */
export const disabledStyles = treatmentAt(library, "treatments.disabled");

/**
 * @deprecated Use the treatment `treatments.interactiveCursor` of a library.
 * @public
 */
export const interactiveCursorStyles = treatmentAt(library, "treatments.interactiveCursor");

/**
 * @deprecated Use the treatment `treatments.focusIndicator` of a library.
 * @public
 */
export const focusIndicatorStyles = treatmentAt(library, "treatments.focusIndicator");

/**
 * @deprecated Use the treatment `treatments.focusReset` of a library.
 * @public
 */
export const focusResetStyles = treatmentAt(library, "treatments.focusReset");

/**
 * The names of the treatments of 0.14, each to the name of its export, which is a deprecated name here.
 *
 * @deprecated A treatment is a token of the library, named by its path, and a name of 0.14 finds it, see `resolveTokenName`.
 * @public
 */
export const StyleNameMapping = {
    "shape.control": "controlShapeStyles",
    "shape.layer": "layerShapeStyles",
    "shape.round": "roundShapeStyles",
    "density.control": "controlDensityStyles",
    "density.control-square": "controlSquareDensityStyles",
    "density.autofill-outer": "autofillOuterDensityStyles",
    "density.autofill-inner": "autofillInnerDensityStyles",
    "density.control-list": "controlListDensityStyles",
    "density.item-container": "controlListDensityStyles",
    "density.layer": "layerDensityStyles",
    "color.accent-fill-stealth-control": "accentFillStealthControlStyles",
    "color.accent-fill-subtle-control": "accentFillSubtleControlStyles",
    "color.accent-fill-subtle-inverse-control": "accentFillSubtleInverseControlStyles",
    "color.accent-fill-ideal-control": "accentFillIdealControlStyles",
    "color.accent-fill-discernible-control": "accentFillDiscernibleControlStyles",
    "color.accent-fill-readable-control": "accentFillReadableControlStyles",
    "color.accent-outline-discernible-control": "accentOutlineDiscernibleControlStyles",
    "color.accent-foreground-readable-control": "accentForegroundReadableControlStyles",
    "color.highlight-fill-stealth-control": "highlightFillStealthControlStyles",
    "color.highlight-fill-subtle-control": "highlightFillSubtleControlStyles",
    "color.highlight-fill-subtle-inverse-control": "highlightFillSubtleInverseControlStyles",
    "color.highlight-fill-ideal-control": "highlightFillIdealControlStyles",
    "color.highlight-fill-discernible-control": "highlightFillDiscernibleControlStyles",
    "color.highlight-fill-readable-control": "highlightFillReadableControlStyles",
    "color.highlight-outline-discernible-control": "highlightOutlineDiscernibleControlStyles",
    "color.highlight-foreground-readable-control": "highlightForegroundReadableControlStyles",
    "color.info-fill-stealth-control": "infoFillStealthControlStyles",
    "color.info-fill-subtle-control": "infoFillSubtleControlStyles",
    "color.info-fill-subtle-inverse-control": "infoFillSubtleInverseControlStyles",
    "color.info-fill-ideal-control": "infoFillIdealControlStyles",
    "color.info-fill-discernible-control": "infoFillDiscernibleControlStyles",
    "color.info-fill-readable-control": "infoFillReadableControlStyles",
    "color.info-outline-discernible-control": "infoOutlineDiscernibleControlStyles",
    "color.info-foreground-readable-control": "infoForegroundReadableControlStyles",
    "color.success-fill-stealth-control": "successFillStealthControlStyles",
    "color.success-fill-subtle-control": "successFillSubtleControlStyles",
    "color.success-fill-subtle-inverse-control": "successFillSubtleInverseControlStyles",
    "color.success-fill-ideal-control": "successFillIdealControlStyles",
    "color.success-fill-discernible-control": "successFillDiscernibleControlStyles",
    "color.success-fill-readable-control": "successFillReadableControlStyles",
    "color.success-outline-discernible-control": "successOutlineDiscernibleControlStyles",
    "color.success-foreground-readable-control": "successForegroundReadableControlStyles",
    "color.warning-fill-stealth-control": "warningFillStealthControlStyles",
    "color.warning-fill-subtle-control": "warningFillSubtleControlStyles",
    "color.warning-fill-subtle-inverse-control": "warningFillSubtleInverseControlStyles",
    "color.warning-fill-ideal-control": "warningFillIdealControlStyles",
    "color.warning-fill-discernible-control": "warningFillDiscernibleControlStyles",
    "color.warning-fill-readable-control": "warningFillReadableControlStyles",
    "color.warning-outline-discernible-control": "warningOutlineDiscernibleControlStyles",
    "color.warning-foreground-readable-control": "warningForegroundReadableControlStyles",
    "color.critical-fill-stealth-control": "criticalFillStealthControlStyles",
    "color.critical-fill-subtle-control": "criticalFillSubtleControlStyles",
    "color.critical-fill-subtle-inverse-control": "criticalFillSubtleInverseControlStyles",
    "color.critical-fill-ideal-control": "criticalFillIdealControlStyles",
    "color.critical-fill-discernible-control": "criticalFillDiscernibleControlStyles",
    "color.critical-fill-readable-control": "criticalFillReadableControlStyles",
    "color.critical-outline-discernible-control": "criticalOutlineDiscernibleControlStyles",
    "color.critical-foreground-readable-control": "criticalForegroundReadableControlStyles",
    "color.neutral-fill-stealth-control": "neutralFillStealthControlStyles",
    "color.neutral-fill-subtle-control": "neutralFillSubtleControlStyles",
    "color.neutral-fill-subtle-inverse-control": "neutralFillSubtleInverseControlStyles",
    "color.neutral-fill-ideal-control": "neutralFillIdealControlStyles",
    "color.neutral-fill-discernible-control": "neutralFillDiscernibleControlStyles",
    "color.neutral-fill-readable-control": "neutralFillReadableControlStyles",
    "color.neutral-outline-discernible-control": "neutralOutlineDiscernibleControlStyles",
    "color.neutral-foreground-readable-element": "neutralForegroundReadableElementStyles",
    "color.neutral-foreground-strong-element": "neutralForegroundStrongElementStyles",
    "color.neutral-divider-subtle-element": "neutralDividerSubtleElementStyles",
    "color.neutral-divider-discernible-element": "neutralDividerDiscernibleElementStyles",
    "text.type-ramp-base": "typeRampBaseStyles",
    "text.type-ramp-minus-1": "typeRampMinus1Styles",
    "text.type-ramp-minus-2": "typeRampMinus2Styles",
    "text.type-ramp-plus-1": "typeRampPlus1Styles",
    "text.type-ramp-plus-2": "typeRampPlus2Styles",
    "text.type-ramp-plus-3": "typeRampPlus3Styles",
    "text.type-ramp-plus-4": "typeRampPlus4Styles",
    "text.type-ramp-plus-5": "typeRampPlus5Styles",
    "text.type-ramp-plus-6": "typeRampPlus6Styles",
    "shadow.card": "shadowCardStyles",
    "shadow.card-interactive": "shadowCardInteractiveStyles",
    "shadow.tooltip": "shadowTooltipStyles",
    "shadow.flyout": "shadowFlyoutStyles",
    "shadow.dialog": "shadowDialogStyles",
    "styles.action-control": "actionStyles",
    "styles.input-base": "inputBaseStyles",
    "styles.input-control": "inputStyles",
    "styles.input-autofill-control": "inputAutofillStyles",
    "styles.selectable-control-selected": "selectableSelectedStyles",
    "styles.selectable-control-unselected": "selectableUnselectedStyles",
    "styles.item-control": "itemStyles",
    "styles.text-plain": "plainTextStyles",
    "styles.text-label": "labelTextStyles",
    "styles.flyout": "flyoutStyles",
    "styles.disabled": "disabledStyles",
    "styles.focus-indicator": "focusIndicatorStyles",
    "styles.focus-reset": "focusResetStyles",
};

/**
 * @deprecated A treatment is a token of the library, named by its path.
 * @public
 */
export type StyleNameMapping = (typeof StyleNameMapping)[keyof typeof StyleNameMapping];
