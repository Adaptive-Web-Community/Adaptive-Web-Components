import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { ListboxOptionAnatomy } from "./listbox-option.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [tokens.treatments.itemControl],
    },
    {
        target : {
            contextCondition: ListboxOptionAnatomy.conditions.selected,
        },
        treatments: [tokens.treatments.selectableControlSelected],
    },
];
