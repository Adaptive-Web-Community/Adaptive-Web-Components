import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    neutralStrokeSubtle,
    plainTextStyles,
    strokeThickness
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: plainTextStyles,
        properties : {
            borderFillTop: neutralStrokeSubtle.rest,
            borderStyleTop: "solid",
            borderThicknessTop: strokeThickness,
        }
    },
];
