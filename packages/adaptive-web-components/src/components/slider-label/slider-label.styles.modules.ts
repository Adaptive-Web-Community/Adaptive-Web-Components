import { css } from "@microsoft/fast-element";
import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import { designUnit, neutralStrokeSubtleRest, typeRampMinus1Styles } from "@adaptive-web/adaptive-ui/reference";
import { SliderLabelAnatomy } from "./slider-label.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        typeRampMinus1Styles,
    ],
    [
        {
            part: SliderLabelAnatomy.parts.mark,
        },
        Styles.fromProperties({
            backgroundFill: neutralStrokeSubtleRest,
            height: css.partial`calc(${designUnit} *2)`, 
            width: css.partial`calc(${designUnit} / 2)`,
        }),
    ]
];
