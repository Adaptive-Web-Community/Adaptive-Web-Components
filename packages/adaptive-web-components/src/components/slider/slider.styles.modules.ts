import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    highlightFillReadableControlStyles,
    neutralStrokeDiscernibleRest,
    roundShapeStyles
} from "@adaptive-web/adaptive-ui/reference";
import { SliderAnatomy } from "./slider.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        controlShapeStyles,
    ],
    [
        {
            part: SliderAnatomy.parts.track,
        },
        Styles.compose([
            controlShapeStyles,
        ],
        {
            backgroundFill: neutralStrokeDiscernibleRest,
        })
    ],
    [
        {
            part: SliderAnatomy.parts.trackStart,
        },
        Styles.compose([
            controlShapeStyles,
            highlightFillReadableControlStyles,
        ]),
    ],
    [
        {
            part: SliderAnatomy.parts.thumb,
        },
        Styles.compose(
            [
                roundShapeStyles,
                highlightFillReadableControlStyles,
            ],
        )
    ],
];
