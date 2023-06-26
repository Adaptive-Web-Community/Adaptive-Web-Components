import { StyleProperty } from "./types.js";

/**
 * Converts a {@link StyleProperty} to a css property name.
 *
 * @param usage - The StyleProperty key.
 * @returns The css property name.
 * @public
 */
export const stylePropertyToCssProperty = (usage: StyleProperty): string => {
    switch (usage) {
        case StyleProperty.backgroundFill:
            return "background-color";
        case StyleProperty.foregroundFill:
            return "color";
        case StyleProperty.borderFillTop:
            return "border-top-color";
        case StyleProperty.borderFillRight:
            return "border-right-color";
        case StyleProperty.borderFillBottom:
            return "border-bottom-color";
        case StyleProperty.borderFillLeft:
            return "border-left-color";
        case StyleProperty.borderThicknessTop:
            return "border-top-width";
        case StyleProperty.borderThicknessRight:
            return "border-right-width";
        case StyleProperty.borderThicknessBottom:
            return "border-bottom-width";
        case StyleProperty.borderThicknessLeft:
            return "border-left-width";
        case StyleProperty.borderStyleTop:
            return "border-top-style";
        case StyleProperty.borderStyleRight:
            return "border-right-style";
        case StyleProperty.borderStyleBottom:
            return "border-bottom-style";
        case StyleProperty.borderStyleLeft:
            return "border-left-style";
        case StyleProperty.cornerRadiusTopLeft:
            return "border-top-left-radius";
        case StyleProperty.cornerRadiusTopRight:
            return "border-top-right-radius";
        case StyleProperty.cornerRadiusBottomRight:
            return "border-bottom-right-radius";
        case StyleProperty.cornerRadiusBottomLeft:
            return "border-bottom-left-radius";
        case StyleProperty.fontFamily:
            return "font-family";
        case StyleProperty.fontSize:
            return "font-size";
        case StyleProperty.fontWeight:
            return "font-weight";
        case StyleProperty.fontStyle:
            return "font-style";
        case StyleProperty.fontVariationSettings:
            return "font-variation-settings";
        case StyleProperty.letterSpacing:
            return "letter-spacing";
        case StyleProperty.lineHeight:
            return "line-height";
        case StyleProperty.paddingTop:
            return "padding-top";
        case StyleProperty.paddingRight:
            return "padding-right";
        case StyleProperty.paddingBottom:
            return "padding-bottom";
        case StyleProperty.paddingLeft:
            return "padding-left";
        case StyleProperty.gap:
            return "gap";
        case StyleProperty.height:
            return "height";
        case StyleProperty.width:
            return "width";
        case StyleProperty.layoutDirection:
            return "flex-direction";
        case StyleProperty.opacity:
            return "opacity";
    }
};
