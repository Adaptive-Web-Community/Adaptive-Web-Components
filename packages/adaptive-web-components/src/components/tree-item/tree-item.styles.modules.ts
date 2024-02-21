import { StyleRules } from "@adaptive-web/adaptive-ui";
import { itemStyles } from "@adaptive-web/adaptive-ui/reference"; 
import { TreeItemAnatomy } from "./tree-item.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: TreeItemAnatomy.parts.control,
        },
        styles: itemStyles,
    },
];
