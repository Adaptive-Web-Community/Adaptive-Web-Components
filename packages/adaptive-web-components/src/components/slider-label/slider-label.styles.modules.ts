import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens, tokenVar } from "../../styles/tokens.js";
import { SliderLabelAnatomy } from "./slider-label.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        treatments: [tokens.typography.ramp.default.treatments.minus1],
    },
    {
        target : {
            part: SliderLabelAnatomy.parts.mark,
        },
        properties: {
            backgroundFill: { rest: tokens.color.neutral.stroke.subtle },
            height: `calc(${tokenVar(tokens.global.designUnit)} * 2)`,
            width: `calc(${tokenVar(tokens.global.designUnit)} / 2)`,
        },
    },
];
