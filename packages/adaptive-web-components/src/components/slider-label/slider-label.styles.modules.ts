import { css } from "@microsoft/fast-element";
import { StyleRules } from "@adaptive-web/adaptive-ui";
import { designUnit, neutralStrokeSubtle, typeRampMinus1Styles } from "@adaptive-web/adaptive-ui/reference";
import { SliderLabelAnatomy } from "./slider-label.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: typeRampMinus1Styles,
    },
    {
        target : {
            part: SliderLabelAnatomy.parts.mark,
        },
        properties: {
            backgroundFill: neutralStrokeSubtle.rest,
            height: css.partial`calc(${designUnit} *2)`, 
            width: css.partial`calc(${designUnit} / 2)`,
        },
    },
];
