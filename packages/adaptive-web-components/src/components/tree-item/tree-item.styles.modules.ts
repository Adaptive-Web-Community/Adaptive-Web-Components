import { StyleModules } from "@adaptive-web/adaptive-ui";
import { itemStyles } from "@adaptive-web/adaptive-ui/reference"; 
import { TreeItemAnatomy } from "./tree-item.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: TreeItemAnatomy.parts.control
        },
        itemStyles
    ],
];
