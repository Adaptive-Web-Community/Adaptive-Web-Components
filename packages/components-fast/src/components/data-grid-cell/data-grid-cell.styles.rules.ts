import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { DataGridCellAnatomy } from "./data-grid-cell.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [
            tokens.shape.treatments.control,
            tokens.density.control.treatment,
            tokens.treatments.textPlain,
        ],
    },
    {
        target : {
            contextCondition: DataGridCellAnatomy.conditions.cellType.columnHeader,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            contextCondition: DataGridCellAnatomy.conditions.cellType.rowHeader,
        },
        treatments: [tokens.treatments.textLabel],
    },
];
