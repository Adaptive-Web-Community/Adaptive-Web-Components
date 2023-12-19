import type { DesignToken } from "@microsoft/fast-foundation";
import {
    densityAdjustmentUnits,
    DesignTokenMetadata,
    DesignTokenType,
    Swatch,
    TypedCSSDesignToken
} from "@adaptive-web/adaptive-ui"
import {
    accentBaseColor,
    accentFillDiscernible,
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
    fillDiscernibleRestDelta,
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
    highlightFillReadable,
    highlightFillStealth,
    highlightFillSubtle,
    highlightStrokeDiscernible,
    highlightStrokeReadable,
    highlightStrokeSafety,
    highlightStrokeStrong,
    highlightStrokeSubtle,
    labelFontFamily,
    labelFontStyle,
    labelFontWeight,
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
    layerFillInteractive,
    neutralBaseColor,
    neutralFillDiscernible,
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
    successFillDiscernible,
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
    warningFillDiscernible,
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
    criticalBaseColor,
    neutralBaseColor,
    layerFillBaseLuminance,
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
    fillDiscernibleRestDelta,
    fillReadableRestDelta,
    strokeSafetyRestDelta,
    strokeStealthRestDelta,
    strokeSubtleRestDelta,
    strokeDiscernibleRestDelta,
    strokeReadableRestDelta,
    strokeStrongRestDelta,
];

const colorTokens: DesignTokenStore<Swatch> = [
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
    accentFillStealth.rest,
    accentFillSubtle.rest,
    accentFillDiscernible.rest,
    accentFillReadable.rest,
    highlightFillStealth.rest,
    highlightFillSubtle.rest,
    highlightFillDiscernible.rest,
    highlightFillReadable.rest,
    criticalFillStealth.rest,
    criticalFillSubtle.rest,
    criticalFillDiscernible.rest,
    criticalFillReadable.rest,
    warningFillStealth.rest,
    warningFillSubtle.rest,
    warningFillDiscernible.rest,
    warningFillReadable.rest,
    successFillStealth.rest,
    successFillSubtle.rest,
    successFillDiscernible.rest,
    successFillReadable.rest,
    neutralFillStealth.rest,
    neutralFillSubtle.rest,
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
    densityControl.horizontalGap,
    densityControl.verticalGap,
    densityItemContainer.horizontalGap,
    densityItemContainer.verticalGap,
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

export function nameToTitle(name: string): string {
    const base = name.replace(/-/g, ' ').replace(/density_/, '');
    return base.charAt(0).toUpperCase() + base.substring(1);
}

function registerStore<T>(
    store: DesignTokenStore<T>,
    groupTitle: string | undefined, // Phasing this out. Currently only used on the "Design Tokens" tab.
    registry: DesignTokenRegistry
): void {
    store.forEach((token) => {
        // console.log("registerStore", token);
        
        const entryIntendedFor = (token instanceof TypedCSSDesignToken ? (token as TypedCSSDesignToken<any>).intendedFor : undefined);

        const entryFormControlId = token.type === DesignTokenType.color ? FormControlId.color : FormControlId.text;

        const definition: DesignTokenDefinition = {
            id: token.name,
            title: nameToTitle(token.name),
            groupTitle,
            intendedFor: entryIntendedFor,
            formControlId: entryFormControlId,
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
};

export const registerAppliableTokens = (registry: DesignTokenRegistry) => {
    registerStore(colorTokens, undefined, registry);
    registerStore(strokeWidthTokens, undefined, registry);
    registerStore(densityTokens, undefined, registry);
    registerStore(cornerRadiusTokens, undefined, registry);
    registerStore(textTokens, undefined, registry);
};
