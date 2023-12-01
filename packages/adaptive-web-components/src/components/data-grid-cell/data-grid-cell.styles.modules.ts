import {
    StyleModules,
    Styles,
} from "@adaptive-web/adaptive-ui";
import {
    controlDensityStyles,
    controlShapeStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference";
import { DataGridCellAnatomy } from "./data-grid-cell.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.compose(
            [
                controlShapeStyles,
                controlDensityStyles,
                plainTextStyles,
            ],
        )
    ],
    [
        {
            hostCondition: DataGridCellAnatomy.conditions.cellTypeColumnHeader,
        },
        Styles.fromProperties({
            fontWeight: "600",
        }),
    ],
    [
        {
            hostCondition: DataGridCellAnatomy.conditions.cellTypeRowHeader,
        },
        Styles.fromProperties({
            fontWeight: "600",
        }),
    ],
];
