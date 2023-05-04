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
 * A subset of {@link DesignTokenDefinition} as a convenience for adding a number of tokens to a {@link DesignTokenRegistry}.
 */
interface DesignTokenStore<T = any> {
    [id: string]: {
        title: string;
        token: DesignToken<T>;
        target?: StyleProperty;
        formControlId?: FormControlId;
    };
}

const designTokens: DesignTokenStore = {
    accentBaseColor: { token: accentBaseColor, title: "Accent base color", formControlId: FormControlId.color },
    neutralBaseColor: { token: neutralBaseColor, title: "Neutral base color", formControlId: FormControlId.color },
    baseLayerLuminance: { token: layerFillBaseLuminance, title: "Layer fill base luminance" },
    fillColor: { token: fillColor, title: "Fill color", formControlId: FormControlId.color },
    docBaseColor: { token: docBaseColor, title: "Doc base color", formControlId: FormControlId.color },
};

const layerTokens: DesignTokenStore<Swatch> = {
    layerFillFixedMinus4: { token: layerFillFixedMinus4, title: "-4" },
    layerFillFixedMinus3: { token: layerFillFixedMinus3, title: "-3" },
    layerFillFixedMinus2: { token: layerFillFixedMinus2, title: "-2" },
    layerFillFixedMinus1: { token: layerFillFixedMinus1, title: "-1" },
    layerFillFixedBase: { token: layerFillFixedBase, title: "Base" },
    layerFillFixedPlus1: { token: layerFillFixedPlus1, title: "+1" },
    layerFillFixedPlus2: { token: layerFillFixedPlus2, title: "+2" },
    layerFillFixedPlus3: { token: layerFillFixedPlus3, title: "+3" },
    layerFillFixedPlus4: { token: layerFillFixedPlus4, title: "+4" },
};

const fillTokens: DesignTokenStore<Swatch> = {
    accentFillRest: { token: accentFillRest, title: "Accent" },
    neutralFillRest: { token: neutralFillRest, title: "Neutral" },
    neutralFillLayerRest: { token: layerFillInteractiveRest, title: "Neutral Layer" },
    neutralFillInputRest: { token: neutralFillInputRest, title: "Neutral Input" },
    neutralFillSecondaryRest: { token: neutralFillSecondaryRest, title: "Neutral Secondary" },
    neutralFillStealthRest: { token: neutralFillStealthRest, title: "Neutral Stealth" },
    neutralFillStrongRest: { token: neutralFillStrongRest, title: "Neutral Strong" },
    docFillRest: { token: docFill, title: "Doc" },
};

const strokeTokens: DesignTokenStore<Swatch> = {
    focusStrokeOuter: { token: focusStrokeOuter, title: "Focus Outer" },
    focusStrokeInner: { token: focusStrokeInner, title: "Focus Inner" },
    neutralStrokeDividerRest: { token: neutralStrokeDividerRest, title: "Divider" },
    neutralStrokeRest: { token: neutralStrokeRest, title: "Neutral" },
    neutralStrokeStrongRest: { token: neutralStrokeStrongRest, title: "Neutral Strong" },
    neutralStrokeInputRest: { token: neutralStrokeInputRest, title: "Neutral Input" },
};

const strokeWidthTokens: DesignTokenStore<number> = {
    strokeWidth: { token: strokeWidth, title: "Stroke width" },
    focusStrokeWidth: { token: focusStrokeWidth, title: "Focus stroke width" },
};

const textFillTokens: DesignTokenStore<Swatch> = {
    neutralForegroundRest: { token: neutralForegroundRest, title: "Neutral" },
    neutralForegroundHint: { token: neutralForegroundHint, title: "Hint" },
    accentForegroundRest: { token: accentForegroundRest, title: "Accent" },
    foregroundOnAccentRest: { token: foregroundOnAccentRest, title: "On Accent" },
    docForegroundRest: { token: docForeground, title: "Doc" },
};

const cornerRadiusTokens: DesignTokenStore<number> = {
    controlCornerRadius: { token: controlCornerRadius, title: "Control" },
    layerCornerRadius: { token: layerCornerRadius, title: "Layer" },
};

const textTokens: DesignTokenStore = {
    bodyFont: {
        target: StyleProperty.fontFamily,
        token: bodyFont,
        title: "Font"
    },
    typeRampPlus6FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus6FontSize,
        title: "Plus 6 font size"
    },
    typeRampPlus6LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus6LineHeight,
        title: "Plus 6 line height",
    },
    typeRampPlus5FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus5FontSize,
        title: "Plus 5 font size"
    },
    typeRampPlus5LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus5LineHeight,
        title: "Plus 5 line height",
    },
    typeRampPlus4FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus4FontSize,
        title: "Plus 4 font size"
    },
    typeRampPlus4LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus4LineHeight,
        title: "Plus 4 line height",
    },
    typeRampPlus3FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampPlus3FontSize,
        title: "Plus 3 font size"
    },
    typeRampPlus3LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus3LineHeight,
        title: "Plus 3 line height",
    },
    typeRampPlus2FontSize: { 
        target: StyleProperty.fontSize,
        token: typeRampPlus2FontSize,
        title: "Plus 2 font size"
        },
    typeRampPlus2LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus2LineHeight,
        title: "Plus 2 line height",
    },
    typeRampPlus1FontSize: { 
        target: StyleProperty.fontSize,
        token: typeRampPlus1FontSize,
        title: "Plus 1 font size"
    },
    typeRampPlus1LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampPlus1LineHeight,
        title: "Plus 1 line height",
    },
    typeRampBaseFontSize: {
        target: StyleProperty.fontSize,
        token: typeRampBaseFontSize,
        title: "Base font size" 
    },
    typeRampBaseLineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampBaseLineHeight,
        title: "Base line height",
    },
    typeRampMinus1FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampMinus1FontSize,
        title: "Minus 1 font size",
    },
    typeRampMinus1LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampMinus1LineHeight,
        title: "Minus 1 line height",
    },
    typeRampMinus2FontSize: {
        target: StyleProperty.fontSize,
        token: typeRampMinus2FontSize,
        title: "Minus 2 font size",
    },
    typeRampMinus2LineHeight: {
        target: StyleProperty.lineHeight,
        token: typeRampMinus2LineHeight,
        title: "Minus 2 line height",
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
            title: entry.title,
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
    // This could be optimized, but some tokens are intended to be modified as well as applied as style properties.
    registerStore(null, textTokens, "Text", registry);
    registerStore(null, strokeWidthTokens, "Stroke width", registry);
    registerStore(null, cornerRadiusTokens, "Corner radius", registry);
};

export const registerAppliableTokens = (registry: DesignTokenRegistry) => {
    registerStore(StyleProperty.backgroundFill, layerTokens, "Layer fill", registry);
    registerStore(StyleProperty.backgroundFill, fillTokens, "Fill", registry);
    registerStore(StyleProperty.foregroundFill, textFillTokens, "Foreground", registry);
    registerStore(StyleProperty.borderFill, strokeTokens, "Stroke", registry);
    registerStore(StyleProperty.borderThickness, strokeWidthTokens, "Stroke width", registry);
    registerStore(StyleProperty.cornerRadius, cornerRadiusTokens, "Corner radius", registry);
    registerStore(null, textTokens, "Text", registry);
};
