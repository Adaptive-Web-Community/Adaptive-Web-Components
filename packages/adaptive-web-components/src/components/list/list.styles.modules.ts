import { StyleRules } from "@adaptive-web/adaptive-ui";
import { densityControl } from "@adaptive-web/adaptive-ui/reference";
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
            gap: densityControl.horizontalGap,
        },
    },
    {
        target : {
            contextCondition: ListAnatomy.conditions.orientation.vertical,
        },
        properties: {
            gap: densityControl.verticalGap,
        },
    },
];
