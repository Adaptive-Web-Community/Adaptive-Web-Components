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
        case StyleProperty.borderFill:
            return "border-color";
        case StyleProperty.borderThickness:
            return "border-width";
        case StyleProperty.borderStyle:
            return "border-style";
        case StyleProperty.cornerRadius:
            return "border-radius";
        case StyleProperty.fontFamily:
            return "font-family";
        case StyleProperty.fontSize:
            return "font-size";
        case StyleProperty.fontWeight:
            return "font-weight";
        case StyleProperty.fontStyle:
            return "font-style";
        case StyleProperty.letterSpacing:
            return "letter-spacing";
        case StyleProperty.lineHeight:
            return "line-height";
        case StyleProperty.padding:
            return "padding";
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
