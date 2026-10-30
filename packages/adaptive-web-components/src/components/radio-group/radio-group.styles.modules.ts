import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { RadioGroupAnatomy } from "./radio-group.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
    {
        target : {
            part: RadioGroupAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: RadioGroupAnatomy.parts.positioningRegion,
        },
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
];
