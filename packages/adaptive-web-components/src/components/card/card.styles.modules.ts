import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    layerFillInteractiveRest,
    layerShapeStyles,
    plainTextStyles,
    shadowCardStyles
} from "@adaptive-web/adaptive-ui/reference";
/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: [
            layerShapeStyles,
            plainTextStyles,
            shadowCardStyles,
        ],
        properties: {
            backgroundFill: layerFillInteractiveRest,
        },
    },
];
