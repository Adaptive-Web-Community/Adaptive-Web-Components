import type { DesignToken } from "@microsoft/fast-foundation";
import {
    accentBaseColor,
    accentFillDiscernibleRest,
    accentFillReadableRest,
    accentFillStealthRest,
    accentFillSubtleRest,
    accentStrokeDiscernibleRest,
    accentStrokeReadableRest,
    accentStrokeSafetyRest,
    accentStrokeStrongRest,
    accentStrokeSubtleRest,
    bodyFontFamily,
    cornerRadiusControl,
    cornerRadiusLayer,
    DesignTokenMetadata,
    DesignTokenType,
    fillColor,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeThickness,
    fontFamily,
    fontWeight,
    labelFontFamily,
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
    layerFillInteractiveRest,
    neutralBaseColor,
    neutralFillDiscernibleRest,
    neutralFillReadableRest,
    neutralFillStealthRest,
    neutralFillSubtleRest,
    neutralStrokeDiscernibleRest,
    neutralStrokeReadableRest,
    neutralStrokeSafetyRest,
    neutralStrokeStrongRest,
    neutralStrokeSubtleRest,
    strokeThickness,
    StyleProperty,
    Swatch,
    TypedCSSDesignToken,
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
} from "@adaptive-web/adaptive-ui";
import { DesignTokenDefinition, DesignTokenRegistry, FormControlId } from "./design-token-registry.js";
import { blackOrWhiteDiscernibleRest, blackOrWhiteReadableRest, docBaseColor, docFill, docForeground } from "./custom-recipes.js";

/**
 * A collection of DesignTokens for adding to a {@link DesignTokenRegistry}.
 */
type DesignTokenStore<T = any> = Array<DesignToken<T> & DesignTokenMetadata>;

const designTokens: DesignTokenStore = [
    accentBaseColor,
    neutralBaseColor,
    layerFillBaseLuminance,
    fillColor,
    docBaseColor,
];

const layerTokens: DesignTokenStore<Swatch> = [
    layerFillFixedMinus4,
    layerFillFixedMinus3,
    layerFillFixedMinus2,
    layerFillFixedMinus1,
    layerFillFixedBase,
    layerFillFixedPlus1,
    layerFillFixedPlus2,
    layerFillFixedPlus3,
    layerFillFixedPlus4,
];

const fillTokens: DesignTokenStore<Swatch> = [
    accentFillStealthRest,
    accentFillSubtleRest,
    accentFillDiscernibleRest,
    accentFillReadableRest,
    neutralFillStealthRest,
    neutralFillSubtleRest,
    neutralFillDiscernibleRest,
    neutralFillReadableRest,
    layerFillInteractiveRest,
    docFill,
];

const strokeTokens: DesignTokenStore<Swatch> = [
    focusStrokeOuter,
    focusStrokeInner,
    accentStrokeSafetyRest,
    accentStrokeSubtleRest,
    accentStrokeDiscernibleRest,
    // TODO: The current bridge model to Adaptive UI doesn't allow for the same tokens in two different style targets.
    // accentStrokeReadableRest,
    // accentStrokeStrongRest,
    neutralStrokeSafetyRest,
    neutralStrokeSubtleRest,
    neutralStrokeDiscernibleRest,
    // neutralStrokeReadableRest,
    // neutralStrokeStrongRest,
];

const strokeWidthTokens: DesignTokenStore = [
    strokeThickness,
    focusStrokeThickness,
];

const textFillTokens: DesignTokenStore<Swatch> = [
    accentStrokeReadableRest,
    accentStrokeStrongRest,
    neutralStrokeReadableRest,
    neutralStrokeStrongRest,
    blackOrWhiteDiscernibleRest,
    blackOrWhiteReadableRest,
    docForeground,
];

const cornerRadiusTokens: DesignTokenStore<string> = [
    cornerRadiusControl,
    cornerRadiusLayer,
];

const textTokens: DesignTokenStore = [
    fontFamily,
    bodyFontFamily,
    labelFontFamily,
    fontWeight,
    typeRampPlus6FontSize,
    typeRampPlus6LineHeight,
    typeRampPlus5FontSize,
    typeRampPlus5LineHeight,
    typeRampPlus4FontSize,
    typeRampPlus4LineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
    typeRampPlus2FontSize,
    typeRampPlus2LineHeight,
    typeRampPlus1FontSize,
    typeRampPlus1LineHeight,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
    typeRampMinus2FontSize,
    typeRampMinus2LineHeight,
];

function nameToTitle(name: string): string {
    const base = name.replace(/-/g, ' ');
    return base.charAt(0).toUpperCase() + base.substr(1);
}

function registerStore<T>(
    target: StyleProperty | undefined,
    store: DesignTokenStore<T>,
    title: string,
    registry: DesignTokenRegistry
): void {
    store.forEach((token) => {
        // console.log("registerStore", token);
        
        const entryTarget = target ||
            (token instanceof TypedCSSDesignToken ? (token as TypedCSSDesignToken<any>).intendedFor?.at(0) : undefined);

        const entryFormControlId = token.allowedType.includes(DesignTokenType.color) ? FormControlId.color : FormControlId.text;

        const definition: DesignTokenDefinition = {
            id: token.name,
            title: nameToTitle(token.name),
            groupTitle: title,
            target: entryTarget,
            formControlId: entryFormControlId,
            token,
        };

        registry.register(definition);
    });
}

export const registerTokens = (registry: DesignTokenRegistry) => {
    registerStore(undefined, designTokens, "Global tokens", registry);
    // This could be optimized, but some tokens are intended to be modified as well as applied as style properties.
    registerStore(undefined, textTokens, "Text", registry);
    registerStore(undefined, strokeWidthTokens, "Stroke width", registry);
    registerStore(undefined, cornerRadiusTokens, "Corner radius", registry);
};

export const registerAppliableTokens = (registry: DesignTokenRegistry) => {
    registerStore(StyleProperty.backgroundFill, layerTokens, "Layer fill", registry);
    registerStore(StyleProperty.backgroundFill, fillTokens, "Fill", registry);
    registerStore(StyleProperty.foregroundFill, textFillTokens, "Foreground", registry);
    registerStore(StyleProperty.borderFill, strokeTokens, "Stroke", registry);
    // These tokens are already setup with intended use style properties.
    registerStore(undefined, strokeWidthTokens, "Stroke width", registry);
    registerStore(undefined, cornerRadiusTokens, "Corner radius", registry);
    registerStore(undefined, textTokens, "Text", registry);
};
