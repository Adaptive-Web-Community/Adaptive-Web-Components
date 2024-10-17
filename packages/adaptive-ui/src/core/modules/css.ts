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
        case StyleProperty.marginTop:
            return "margin-top";
        case StyleProperty.marginRight:
            return "margin-right";
        case StyleProperty.marginBottom:
            return "margin-bottom";
        case StyleProperty.marginLeft:
            return "margin-left";
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
        case StyleProperty.minHeight:
            return "min-height";
        case StyleProperty.maxHeight:
            return "max-height";
        case StyleProperty.width:
            return "width";
        case StyleProperty.minWidth:
            return "min-width";
        case StyleProperty.maxWidth:
            return "max-width";
        case StyleProperty.layoutInner:
            return "display";
        case StyleProperty.layoutDirection:
            return "flex-direction";
        case StyleProperty.layoutMainAxisAlignItems:
            return "justify-content";
        case StyleProperty.layoutCrossAxisAlignItems:
            return "align-items";
        case StyleProperty.opacity:
            return "opacity";
        case StyleProperty.cursor:
            return "cursor";
        case StyleProperty.outlineColor:
            return "outline-color";
        case StyleProperty.outlineOffset:
            return "outline-offset";
        case StyleProperty.outlineStyle:
            return "outline-style";
        case StyleProperty.outlineThickness:
            return "outline-width";
        case StyleProperty.outlineWidth:
            return "outline-width";
        case StyleProperty.shadow:
            return "box-shadow";
    }
};
