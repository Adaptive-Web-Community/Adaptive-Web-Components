import { sentenceCase } from "change-case";
import type { DesignToken } from "@microsoft/fast-foundation";
import {
    Color,
    densityAdjustmentUnits,
    DesignTokenMetadata,
    DesignTokenType,
    TypedCSSDesignToken
} from "@adaptive-web/adaptive-ui"
import {
    accentBaseColor,
    accentFillDiscernible,
    accentFillIdeal,
    accentFillReadable,
    accentFillStealth,
    accentFillSubtle,
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
    criticalStrokeDiscernible,
    criticalStrokeReadable,
    criticalStrokeSafety,
    criticalStrokeStrong,
    criticalStrokeSubtle,
    densityControl,
    densityItemContainer,
    densityLayer,
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
    warningStrokeDiscernible,
    warningStrokeReadable,
    warningStrokeSafety,
    warningStrokeStrong,
    warningStrokeSubtle,
    wcagContrastLevel,
} from "@adaptive-web/adaptive-ui/reference";
import { DesignTokenDefinition, DesignTokenRegistry, FormControlId } from "./design-token-registry.js";
import { blackOrWhiteDiscernibleRest, blackOrWhiteReadableRest, docBaseColor, docFill, docForeground } from "./custom-recipes.js";

/**
 * A collection of DesignTokens for adding to a {@link DesignTokenRegistry}.
 */
type DesignTokenStore<T = any> = Array<DesignToken<T> & DesignTokenMetadata>;

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
    docBaseColor,
    wcagContrastLevel,
    densityAdjustmentUnits,
    densityControl.horizontalPaddingUnits,
    densityControl.horizontalGapUnits,
    densityControl.verticalPaddingUnits,
    densityControl.verticalGapUnits,
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

const colorTokens: DesignTokenStore<Color> = [
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
    layerFillInteractive.rest,
    // Fill
    accentBaseColor,
    accentFillStealth.rest,
    accentFillSubtle.rest,
    accentFillIdeal.rest,
    accentFillDiscernible.rest,
    accentFillReadable.rest,
    highlightBaseColor,
    highlightFillStealth.rest,
    highlightFillSubtle.rest,
    highlightFillIdeal.rest,
    highlightFillDiscernible.rest,
    highlightFillReadable.rest,
    criticalBaseColor,
    criticalFillStealth.rest,
    criticalFillSubtle.rest,
    criticalFillIdeal.rest,
    criticalFillDiscernible.rest,
    criticalFillReadable.rest,
    warningBaseColor,
    warningFillStealth.rest,
    warningFillSubtle.rest,
    warningFillIdeal.rest,
    warningFillDiscernible.rest,
    warningFillReadable.rest,
    successBaseColor,
    successFillStealth.rest,
    successFillSubtle.rest,
    successFillIdeal.rest,
    successFillDiscernible.rest,
    successFillReadable.rest,
    infoBaseColor,
    infoFillStealth.rest,
    infoFillSubtle.rest,
    infoFillIdeal.rest,
    infoFillDiscernible.rest,
    infoFillReadable.rest,
    neutralBaseColor,
    neutralFillStealth.rest,
    neutralFillSubtle.rest,
    neutralFillIdeal.rest,
    neutralFillDiscernible.rest,
    neutralFillReadable.rest,
    // Stroke
    focusStroke,
    focusStrokeOuter,
    focusStrokeInner,
    accentStrokeSafety.rest,
    accentStrokeSubtle.rest,
    accentStrokeDiscernible.rest,
    accentStrokeReadable.rest,
    accentStrokeStrong.rest,
    highlightStrokeSafety.rest,
    highlightStrokeSubtle.rest,
    highlightStrokeDiscernible.rest,
    highlightStrokeReadable.rest,
    highlightStrokeStrong.rest,
    criticalStrokeSafety.rest,
    criticalStrokeSubtle.rest,
    criticalStrokeDiscernible.rest,
    criticalStrokeReadable.rest,
    criticalStrokeStrong.rest,
    warningStrokeSafety.rest,
    warningStrokeSubtle.rest,
    warningStrokeDiscernible.rest,
    warningStrokeReadable.rest,
    warningStrokeStrong.rest,
    successStrokeSafety.rest,
    successStrokeSubtle.rest,
    successStrokeDiscernible.rest,
    successStrokeReadable.rest,
    successStrokeStrong.rest,
    infoStrokeSafety.rest,
    infoStrokeSubtle.rest,
    infoStrokeDiscernible.rest,
    infoStrokeReadable.rest,
    infoStrokeStrong.rest,
    neutralStrokeSafety.rest,
    neutralStrokeSubtle.rest,
    neutralStrokeDiscernible.rest,
    neutralStrokeReadable.rest,
    neutralStrokeStrong.rest,
    // Custom
    blackOrWhiteDiscernibleRest,
    blackOrWhiteReadableRest,
    docForeground,
    docFill,
];

const strokeWidthTokens: DesignTokenStore = [
    strokeThickness,
    focusStrokeThickness,
];

const densityTokens: DesignTokenStore<string> = [
    densityControl.horizontalPadding,
    densityControl.verticalPadding,
    densityControl.horizontalGap,
    densityControl.verticalGap,
    densityItemContainer.horizontalPadding,
    densityItemContainer.verticalPadding,
    densityItemContainer.horizontalGap,
    densityItemContainer.verticalGap,
    densityLayer.horizontalPadding,
    densityLayer.verticalPadding,
    densityLayer.horizontalGap,
    densityLayer.verticalGap,
];

const cornerRadiusTokens: DesignTokenStore<string> = [
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

export function nameToTitle(name: string): string {
    const base = name.replace(/-/g, ' ').replace(/density_/, '');
    return sentenceCase(base);
}

function registerStore<T>(
    store: DesignTokenStore<T>,
    groupTitle: string | undefined, // Phasing this out. Currently only used on the "Design Tokens" tab.
    registry: DesignTokenRegistry
): void {
    store.forEach((token) => {
        // console.log("registerStore", token);

        // Handle legacy non-hierarchical format for `custom-recipes.ts`.
        const title = nameToTitle(token.name.indexOf(".") > -1 ? token.name.split(".").slice(1).join("-") : token.name);
        const intendedFor = (token instanceof TypedCSSDesignToken ? (token as TypedCSSDesignToken<any>).intendedFor : undefined);
        const formControlId = token.type === DesignTokenType.color ? FormControlId.color : FormControlId.text;

        const definition: DesignTokenDefinition = {
            id: token.name,
            title,
            groupTitle,
            intendedFor,
            formControlId,
            token,
        };

        registry.register(definition);
    });
}

// This registration system is being phased out. The remaining task is to determine if a design token is a static value or derived. If it's
// static we'll show it on the "Tokens" registry for the "Design Tokens" tab where the value can be overridden. Eventually we'll need an
// interface for mapping tokens to other recipes or fixed values as well.
// For now we've grouped the color tokens since by default those are all recipes/derived.

export const registerTokens = (registry: DesignTokenRegistry) => {
    registerStore(designTokens, "Global tokens", registry);
    // This could be optimized, but some tokens are intended to be modified as well as applied as style properties.
    registerStore(strokeWidthTokens, "Stroke width", registry);
    registerStore(cornerRadiusTokens, "Corner radius", registry);
    registerStore(textTokens, "Text", registry);
    registerStore(effectsTokens, "Effects", registry);
};

export const registerAppliableTokens = (registry: DesignTokenRegistry) => {
    registerStore(colorTokens, undefined, registry);
    registerStore(strokeWidthTokens, undefined, registry);
    registerStore(densityTokens, undefined, registry);
    registerStore(cornerRadiusTokens, undefined, registry);
    registerStore(textTokens, undefined, registry);
};
