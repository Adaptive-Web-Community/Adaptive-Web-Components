import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    flyoutStyles,
    itemContainerDensityStyles,
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: [
            itemContainerDensityStyles,
            flyoutStyles,
        ],
    },
];
