import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    itemStyles,
    selectableSelectedStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { ListboxOptionAnatomy } from "./listbox-option.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: itemStyles,
    },
    {
        target : {
            hostCondition: ListboxOptionAnatomy.conditions.selected,
        },
        styles: selectableSelectedStyles,
    },
];
