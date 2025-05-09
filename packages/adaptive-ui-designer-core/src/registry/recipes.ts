import { densityAdjustmentUnits, DesignTokenMetadata } from "@adaptive-web/adaptive-ui"
import {
    accentBaseColor,
    accentFillDiscernible,
    accentFillIdeal,
    accentFillReadable,
    accentFillStealth,
    accentFillSubtle,
    accentFillSubtleInverse,
    accentStrokeDiscernible,
    accentStrokeReadable,
    accentStrokeSafety,
    accentStrokeStrong,
    accentStrokeSubtle,
    bodyFontFamily,
    bodyFontStyle,
    bodyFontWeight,
    cornerRadiusControl,
    cornerRadiusLayer,
    criticalBaseColor,
    criticalFillDiscernible,
    criticalFillIdeal,
    criticalFillReadable,
    criticalFillStealth,
    criticalFillSubtle,
    criticalFillSubtleInverse,
    criticalStrokeDiscernible,
    criticalStrokeReadable,
    criticalStrokeSafety,
    criticalStrokeStrong,
    criticalStrokeSubtle,
    densityControl,
    densityControlList,
    densityItemContainer,
    densityLayer,
    densityText,
    elevationCardRest,
    elevationDialog,
    elevationFlyout,
    elevationTooltip,
    fillDiscernibleRestDelta,
    fillIdealRestDelta,
    fillReadableRestDelta,
    fillStealthRestDelta,
    fillSubtleRestDelta,
    focusStroke,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeThickness,
    fontFamily,
    fontStyle,
    fontWeight,
    highlightBaseColor,
    highlightFillDiscernible,
    highlightFillIdeal,
    highlightFillReadable,
    highlightFillStealth,
    highlightFillSubtle,
    highlightFillSubtleInverse,
    highlightStrokeDiscernible,
    highlightStrokeReadable,
    highlightStrokeSafety,
    highlightStrokeStrong,
    highlightStrokeSubtle,
    infoBaseColor,
    infoFillDiscernible,
    infoFillIdeal,
    infoFillReadable,
    infoFillStealth,
    infoFillSubtle,
    infoFillSubtleInverse,
    infoStrokeDiscernible,
    infoStrokeReadable,
    infoStrokeSafety,
    infoStrokeStrong,
    infoStrokeSubtle,
    labelFontFamily,
    labelFontStyle,
    labelFontWeight,
    layerFillActiveDelta,
    layerFillBaseLuminance,
    layerFillFixedBase,
    layerFillFixedMinus1,
    layerFillFixedMinus2,
    layerFillFixedMinus3,
    layerFillFixedMinus4,
    layerFillFixedPlus1,
    layerFillFixedPlus2,
    layerFillFixedPlus3,
    layerFillFixedPlus4,
    layerFillFocusDelta,
    layerFillHoverDelta,
    layerFillInteractive,
    layerFillRestDelta,
    neutralBaseColor,
    neutralFillDiscernible,
    neutralFillIdeal,
    neutralFillReadable,
    neutralFillStealth,
    neutralFillSubtle,
    neutralFillSubtleInverse,
    neutralStrokeDiscernible,
    neutralStrokeReadable,
    neutralStrokeSafety,
    neutralStrokeStrong,
    neutralStrokeSubtle,
    strokeDiscernibleRestDelta,
    strokeReadableRestDelta,
    strokeSafetyRestDelta,
    strokeStealthRestDelta,
    strokeStrongRestDelta,
    strokeSubtleRestDelta,
    strokeThickness,
    successBaseColor,
    successFillDiscernible,
    successFillIdeal,
    successFillReadable,
    successFillStealth,
    successFillSubtle,
    successFillSubtleInverse,
    successStrokeDiscernible,
    successStrokeReadable,
    successStrokeSafety,
    successStrokeStrong,
    successStrokeSubtle,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
    typeRampMinus2FontSize,
    typeRampMinus2LineHeight,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2LineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
    typeRampPlus4FontSize,
    typeRampPlus4LineHeight,
    typeRampPlus5FontSize,
    typeRampPlus5LineHeight,
    typeRampPlus6FontSize,
    typeRampPlus6LineHeight,
    warningBaseColor,
    warningFillDiscernible,
    warningFillIdeal,
    warningFillReadable,
    warningFillStealth,
    warningFillSubtle,
    warningFillSubtleInverse,
    warningStrokeDiscernible,
    warningStrokeReadable,
    warningStrokeSafety,
    warningStrokeStrong,
    warningStrokeSubtle,
    wcagContrastLevel,
} from "@adaptive-web/adaptive-ui/reference";
import { AdaptiveDesignToken, AdaptiveDesignTokenOrGroup, DesignTokenRegistry } from "./design-token-registry.js";

/**
 * A collection of DesignTokens for adding to a {@link DesignTokenRegistry}.
 */
type Store<T extends { name: string } & DesignTokenMetadata> = Array<T>;

type DesignTokenStore = Store<AdaptiveDesignToken>;

type DesignTokenOrGroupStore = Store<AdaptiveDesignTokenOrGroup>;

const designTokens: DesignTokenStore = [
    accentBaseColor,
    highlightBaseColor,
    neutralBaseColor,
    infoBaseColor,
    successBaseColor,
    warningBaseColor,
    criticalBaseColor,
    layerFillBaseLuminance,
    layerFillRestDelta,
    layerFillHoverDelta,
    layerFillActiveDelta,
    layerFillFocusDelta,
    wcagContrastLevel,
    densityAdjustmentUnits,
    densityText.horizontalPaddingUnits,
    densityText.horizontalGapUnits,
    densityText.verticalPaddingUnits,
    densityText.verticalGapUnits,
    densityControl.horizontalPaddingUnits,
    densityControl.horizontalGapUnits,
    densityControl.verticalPaddingUnits,
    densityControl.verticalGapUnits,
    densityControlList.horizontalPaddingUnits,
    densityControlList.horizontalGapUnits,
    densityControlList.verticalPaddingUnits,
    densityControlList.verticalGapUnits,
    densityItemContainer.horizontalPaddingUnits,
    densityItemContainer.horizontalGapUnits,
    densityItemContainer.verticalPaddingUnits,
    densityItemContainer.verticalGapUnits,
    densityLayer.horizontalPaddingUnits,
    densityLayer.horizontalGapUnits,
    densityLayer.verticalPaddingUnits,
    densityLayer.verticalGapUnits,
    fillStealthRestDelta,
    fillSubtleRestDelta,
    fillIdealRestDelta,
    fillDiscernibleRestDelta,
    fillReadableRestDelta,
    strokeSafetyRestDelta,
    strokeStealthRestDelta,
    strokeSubtleRestDelta,
    strokeDiscernibleRestDelta,
    strokeReadableRestDelta,
    strokeStrongRestDelta,
];

const colorTokens: DesignTokenOrGroupStore = [
    // Layer
    layerFillFixedMinus4,
    layerFillFixedMinus3,
    layerFillFixedMinus2,
    layerFillFixedMinus1,
    layerFillFixedBase,
    layerFillFixedPlus1,
    layerFillFixedPlus2,
    layerFillFixedPlus3,
    layerFillFixedPlus4,
    layerFillInteractive,
    // Fill
    accentBaseColor,
    accentFillStealth,
    accentFillSubtle,
    accentFillSubtleInverse,
    accentFillIdeal,
    accentFillDiscernible,
    accentFillReadable,
    highlightBaseColor,
    highlightFillStealth,
    highlightFillSubtle,
    highlightFillSubtleInverse,
    highlightFillIdeal,
    highlightFillDiscernible,
    highlightFillReadable,
    criticalBaseColor,
    criticalFillStealth,
    criticalFillSubtle,
    criticalFillSubtleInverse,
    criticalFillIdeal,
    criticalFillDiscernible,
    criticalFillReadable,
    warningBaseColor,
    warningFillStealth,
    warningFillSubtle,
    warningFillSubtleInverse,
    warningFillIdeal,
    warningFillDiscernible,
    warningFillReadable,
    successBaseColor,
    successFillStealth,
    successFillSubtle,
    successFillSubtleInverse,
    successFillIdeal,
    successFillDiscernible,
    successFillReadable,
    infoBaseColor,
    infoFillStealth,
    infoFillSubtle,
    infoFillSubtleInverse,
    infoFillIdeal,
    infoFillDiscernible,
    infoFillReadable,
    neutralBaseColor,
    neutralFillStealth,
    neutralFillSubtle,
    neutralFillSubtleInverse,
    neutralFillIdeal,
    neutralFillDiscernible,
    neutralFillReadable,
    // Stroke
    focusStroke,
    focusStrokeOuter,
    focusStrokeInner,
    accentStrokeSafety,
    accentStrokeSubtle,
    accentStrokeDiscernible,
    accentStrokeReadable,
    accentStrokeStrong,
    highlightStrokeSafety,
    highlightStrokeSubtle,
    highlightStrokeDiscernible,
    highlightStrokeReadable,
    highlightStrokeStrong,
    criticalStrokeSafety,
    criticalStrokeSubtle,
    criticalStrokeDiscernible,
    criticalStrokeReadable,
    criticalStrokeStrong,
    warningStrokeSafety,
    warningStrokeSubtle,
    warningStrokeDiscernible,
    warningStrokeReadable,
    warningStrokeStrong,
    successStrokeSafety,
    successStrokeSubtle,
    successStrokeDiscernible,
    successStrokeReadable,
    successStrokeStrong,
    infoStrokeSafety,
    infoStrokeSubtle,
    infoStrokeDiscernible,
    infoStrokeReadable,
    infoStrokeStrong,
    neutralStrokeSafety,
    neutralStrokeSubtle,
    neutralStrokeDiscernible,
    neutralStrokeReadable,
    neutralStrokeStrong,
];

const strokeWidthTokens: DesignTokenStore = [
    strokeThickness,
    focusStrokeThickness,
];

const densityTokens: DesignTokenStore = [
    densityText.horizontalPadding,
    densityText.horizontalGap,
    densityText.verticalPadding,
    densityText.verticalGap,
    densityControl.horizontalPadding,
    densityControl.verticalPadding,
    densityControl.horizontalGap,
    densityControl.verticalGap,
    densityControlList.horizontalPadding,
    densityControlList.horizontalGap,
    densityControlList.verticalPadding,
    densityControlList.verticalGap,
    densityItemContainer.horizontalPadding,
    densityItemContainer.verticalPadding,
    densityItemContainer.horizontalGap,
    densityItemContainer.verticalGap,
    densityLayer.horizontalPadding,
    densityLayer.verticalPadding,
    densityLayer.horizontalGap,
    densityLayer.verticalGap,
];

const cornerRadiusTokens: DesignTokenStore = [
    cornerRadiusControl,
    cornerRadiusLayer,
];

const textTokens: DesignTokenStore = [
    fontFamily,
    bodyFontFamily,
    labelFontFamily,
    fontStyle,
    bodyFontStyle,
    labelFontStyle,
    fontWeight,
    bodyFontWeight,
    labelFontWeight,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
    typeRampMinus2FontSize,
    typeRampMinus2LineHeight,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2LineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
    typeRampPlus4FontSize,
    typeRampPlus4LineHeight,
    typeRampPlus5FontSize,
    typeRampPlus5LineHeight,
    typeRampPlus6FontSize,
    typeRampPlus6LineHeight,
];

const effectsTokens: DesignTokenStore = [
    elevationCardRest,
    elevationTooltip,
    elevationFlyout,
    elevationDialog,
];

function registerStore<T extends { name: string } & DesignTokenMetadata>(
    store: Store<T>,
    registry: DesignTokenRegistry<T>
): void {
    store.forEach((token) => {
        // console.log("registerStore", token);
        registry.register(token);
    });
}

// This registration system is being phased out. The remaining task is to determine if a design token is a static value or derived. If it's
// static we'll show it on the "Tokens" registry for the "Design Tokens" tab where the value can be overridden. Eventually we'll need an
// interface for mapping tokens to other recipes or fixed values as well.
// For now we've grouped the color tokens since by default those are all recipes/derived.

export const registerTokens = (registry: DesignTokenRegistry<AdaptiveDesignToken>) => {
    registerStore(designTokens, registry);
    // This could be optimized, but some tokens are intended to be modified as well as applied as style properties.
    registerStore(strokeWidthTokens, registry);
    registerStore(cornerRadiusTokens, registry);
    registerStore(textTokens, registry);
    registerStore(effectsTokens, registry);
};

export const registerAppliableTokens = (registry: DesignTokenRegistry<AdaptiveDesignTokenOrGroup>) => {
    registerStore(colorTokens, registry);
    registerStore(strokeWidthTokens, registry);
    registerStore(densityTokens, registry);
    registerStore(cornerRadiusTokens, registry);
    registerStore(textTokens, registry);
};
