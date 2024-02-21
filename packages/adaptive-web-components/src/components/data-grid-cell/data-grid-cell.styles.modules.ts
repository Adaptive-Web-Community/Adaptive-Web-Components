import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlDensityStyles,
    controlShapeStyles,
    labelTextStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference";
import { DataGridCellAnatomy } from "./data-grid-cell.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: [
            controlShapeStyles,
            controlDensityStyles,
            plainTextStyles,
        ],
    },
    {
        target : {
            hostCondition: DataGridCellAnatomy.conditions.cellTypeColumnHeader,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            hostCondition: DataGridCellAnatomy.conditions.cellTypeRowHeader,
        },
        styles: labelTextStyles,
    },
];
