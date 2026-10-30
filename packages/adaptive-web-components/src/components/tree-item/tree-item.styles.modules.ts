import { onFill, StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
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
        treatments: [tokens.treatments.itemControl],
    },
    {
        // The button on the item, hovered with it: the subtle fill made on the fill of the item, as 0.14 made the hover of the stealth fill
        // on the hover of the item (the subtle fill at rest is the stealth fill in hover).
        target : {
            part: TreeItemAnatomy.parts.expandCollapseButton,
            partCondition: ":hover",
            stateOnContext: true,
        },
        properties: {
            backgroundFill: onFill(tokens.color.neutral.fill.subtle, { fill: tokens.color.neutral.fill.stealth }),
        },
    },
];
