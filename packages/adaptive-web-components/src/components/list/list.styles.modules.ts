import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { ListAnatomy } from "./list.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            contextCondition: ListAnatomy.conditions.orientation.horizontal,
        },
        properties: {
            gap: tokens.density.control.horizontal.gap,
        },
    },
    {
        target : {
            contextCondition: ListAnatomy.conditions.orientation.vertical,
        },
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
];
