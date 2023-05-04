import type { DesignToken } from "@microsoft/fast-foundation";
import {
    accentBaseColor,
    accentFillRest,
    accentForegroundRest,
    bodyFont,
    controlCornerRadius,
    fillColor,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentRest,
    layerCornerRadius,
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
    neutralFillInputRest,
    neutralFillRest,
    neutralFillSecondaryRest,
    neutralFillStealthRest,
    neutralFillStrongRest,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralStrokeDividerRest,
    neutralStrokeInputRest,
    neutralStrokeRest,
    neutralStrokeStrongRest,
    strokeWidth,
    StyleProperty,
    Swatch,
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
import { docBaseColor, docFill, docForeground } from "./custom-recipes.js";

/**
 * A subset of DesignTokenDefinition as a convenience for adding a number of tokens to a DesignTokenRegistry.
 */
interface DesignTokenStore<T = any> {
    [key: string]: {
        name: string;
        token: DesignToken<T>;
        target?: StyleProperty;
        formControlId?: string;
    };
}

const designTokens: DesignTokenStore = {
    accentBaseColor: { token: accentBaseColor, name: "Accent base color", formControlId: FormControlId.color },
    neutralBaseColor: { token: neutralBaseColor, name: "Neutral base color", formControlId: FormControlId.color },
    baseLayerLuminance: { token: layerFillBaseLuminance, name: "Layer fill base luminance" },
    fillColor: { token: fillColor, name: "Fill color", formControlId: FormControlId.color },
    docBaseColor: { token: docBaseColor, name: "Doc base color", formControlId: FormControlId.color },
};

const layerRecipes: DesignTokenStore<Swatch> = {
    layerFillFixedMinus4: { token: layerFillFixedMinus4, name: "-4" },
    layerFillFixedMinus3: { token: layerFillFixedMinus3, name: "-3" },
    layerFillFixedMinus2: { token: layerFillFixedMinus2, name: "-2" },
    layerFillFixedMinus1: { token: layerFillFixedMinus1, name: "-1" },
    layerFillFixedBase: { token: layerFillFixedBase, name: "Base" },
    layerFillFixedPlus1: { token: layerFillFixedPlus1, name: "+1" },
    layerFillFixedPlus2: { token: layerFillFixedPlus2, name: "+2" },
    layerFillFixedPlus3: { token: layerFillFixedPlus3, name: "+3" },
    layerFillFixedPlus4: { token: layerFillFixedPlus4, name: "+4" },
};

const fillRecipes: DesignTokenStore<Swatch> = {
    accentFillRest: { token: accentFillRest, name: "Accent" },
    neutralFillRest: { token: neutralFillRest, name: "Neutral" },
    neutralFillLayerRest: { token: layerFillInteractiveRest, name: "Neutral Layer" },
    neutralFillInputRest: { token: neutralFillInputRest, name: "Neutral Input" },
    neutralFillSecondaryRest: { token: neutralFillSecondaryRest, name: "Neutral Secondary" },
    neutralFillStealthRest: { token: neutralFillStealthRest, name: "Neutral Stealth" },
    neutralFillStrongRest: { token: neutralFillStrongRest, name: "Neutral Strong" },
    docFillRest: { token: docFill, name: "Doc" },
};

const strokeRecipes: DesignTokenStore<Swatch> = {
    focusStrokeOuter: { token: focusStrokeOuter, name: "Focus Outer" },
    focusStrokeInner: { token: focusStrokeInner, name: "Focus Inner" },
    neutralStrokeDividerRest: { token: neutralStrokeDividerRest, name: "Divider" },
    neutralStrokeRest: { token: neutralStrokeRest, name: "Neutral" },
    neutralStrokeStrongRest: { token: neutralStrokeStrongRest, name: "Neutral Strong" },
    neutralStrokeInputRest: { token: neutralStrokeInputRest, name: "Neutral Input" },
};

const strokeWidthRecipes: DesignTokenStore<number> = {
    strokeWidth: { token: strokeWidth, name: "Stroke width" },
    focusStrokeWidth: { token: focusStrokeWidth, name: "Focus stroke width" },
};

const textFillRecipes: DesignTokenStore<Swatch> = {
    neutralForegroundRest: { token: neutralForegroundRest, name: "Neutral" },
    neutralForegroundHint: { token: neutralForegroundHint, name: "Hint" },
    accentForegroundRest: { token: accentForegroundRest, name: "Accent" },
    foregroundOnAccentRest: { token: foregroundOnAccentRest, name: "On Accent" },
    docForegroundRest: { token: docForeground, name: "Doc" },
};

const cornerRadiusRecipes: DesignTokenStore<number> = {
    controlCornerRadius: { token: controlCornerRadius, name: "Control" },
    layerCornerRadius: { token: layerCornerRadius, name: "Layer" },
};

const textRecipes: DesignTokenStore = {
    bodyFont: {
        target: StyleProperty.fontFamily,
        token: bodyFont,
        name: "Font"
    },
    typeRampPlus6FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus6FontSize,
        name: "Plus 6 font size"
    },
    typeRampPlus6LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus6LineHeight,
        name: "Plus 6 line height",
    },
    typeRampPlus5FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus5FontSize,
        name: "Plus 5 font size"
    },
    typeRampPlus5LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus5LineHeight,
        name: "Plus 5 line height",
    },
    typeRampPlus4FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus4FontSize,
        name: "Plus 4 font size"
    },
    typeRampPlus4LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus4LineHeight,
        name: "Plus 4 line height",
    },
    typeRampPlus3FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus3FontSize,
        name: "Plus 3 font size"
    },
    typeRampPlus3LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus3LineHeight,
        name: "Plus 3 line height",
    },
    typeRampPlus2FontSize: { 
        target: StyleProperty.fontSize,
        token: typeRampPlus2FontSize,
        name: "Plus 2 font size"
        },
    typeRampPlus2LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus2LineHeight,
        name: "Plus 2 line height",
    },
    typeRampPlus1FontSize: { 
        target: StyleProperty.fontSize,
        token: typeRampPlus1FontSize,
        name: "Plus 1 font size"
    },
    typeRampPlus1LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus1LineHeight,
        name: "Plus 1 line height",
    },
    typeRampBaseFontSize: {
        target: StyleProperty.fontSize,
        token: typeRampBaseFontSize,
        name: "Base font size" 
    },
    typeRampBaseLineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampBaseLineHeight,
        name: "Base line height",
    },
    typeRampMinus1FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampMinus1FontSize,
        name: "Minus 1 font size",
    },
    typeRampMinus1LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampMinus1LineHeight,
        name: "Minus 1 line height",
    },
    typeRampMinus2FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampMinus2FontSize,
        name: "Minus 2 font size",
    },
    typeRampMinus2LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampMinus2LineHeight,
        name: "Minus 2 line height",
    },
};

function registerStore<T>(
    target: StyleProperty | null,
    store: DesignTokenStore<T>,
    title: string,
    registry: DesignTokenRegistry
): void {
    Object.keys(store).forEach((key: string) => {
        const entry = store[key];

        const entryTarget = target || entry.target;
        const definition: DesignTokenDefinition = {
            id: key,
            name: entry.name,
            groupTitle: title,
            target: entryTarget,
            formControlId: entry.formControlId,
            token: entry.token,
        };

        registry.register(definition);
    });
}

export const registerTokens = (registry: DesignTokenRegistry) => {
    registerStore(null, designTokens, "Global tokens", registry);
    // This could be optimized, but some tokens are intended to be modified as well as applied as recipes.
    registerStore(null, textRecipes, "Text", registry);
    registerStore(null, strokeWidthRecipes, "Stroke width", registry);
    registerStore(null, cornerRadiusRecipes, "Corner radius", registry);
};

export const registerRecipes = (registry: DesignTokenRegistry) => {
    registerStore(StyleProperty.backgroundFill, layerRecipes, "Layer fill", registry);
    registerStore(StyleProperty.backgroundFill, fillRecipes, "Fill", registry);
    registerStore(StyleProperty.foregroundFill, textFillRecipes, "Foreground", registry);
    registerStore(StyleProperty.borderFill, strokeRecipes, "Stroke", registry);
    registerStore(StyleProperty.borderThickness, strokeWidthRecipes, "Stroke width", registry);
    registerStore(StyleProperty.cornerRadius, cornerRadiusRecipes, "Corner radius", registry);
    registerStore(null, textRecipes, "Text", registry);
};
